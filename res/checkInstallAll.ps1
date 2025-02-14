# First make sure script is running as admin
param (
    [string]$WorkingDir
)

# Define log file path
$logFile = "C:\viavr-install.log"
$failedInstalls = @()

# Function to log messages
function Write-Log {
    param (
        [string]$message
    )
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "$timestamp - $message" | Out-File -FilePath $logFile -Append -Encoding utf8
}

function Check-Admin {
    return ([bool](New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator))
}

function Relaunch-AsAdmin {
    Push-Location $PSScriptRoot
    $workingDir = (Get-Location).Path
    $scriptPath = "$workingDir\checkInstallAll.ps1"
    Start-Process -FilePath "powershell.exe" `
                -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$scriptPath`" -WorkingDir `"$workingDir`"" `
                -Verb RunAs
    exit
}

function Check-Command {
    param (
        [string]$commandLine
    )
    try {
        $parts = $commandLine -split " "
        & $parts[0] $parts[1..$parts.Length] > $null 2>&1
        return $true
    } catch {
        return $false
    }
}

function Install-Software {
    param (
        [string]$Name,
        [scriptblock]$InstallScript,
        [scriptblock]$CheckInstalled
    )

    Write-Host "Checking if $Name is already installed..."
    Write-Log "Checking if $Name is already installed..."

    if (&$CheckInstalled) {
        Write-Host "$Name is already installed. Skipping installation." -ForegroundColor Green
        Write-Log "$Name is already installed. Skipping installation."
        return
    }

    Write-Host "Starting installation: $Name"
    Write-Log "Starting installation: $Name"

    $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
    &$InstallScript
    $stopwatch.Stop()

    if (&$CheckInstalled) {
        Write-Host "$Name installation completed in $($stopwatch.Elapsed.TotalSeconds) seconds." -ForegroundColor Green
        Write-Log "$Name installation took: $($stopwatch.Elapsed.TotalSeconds) seconds"
    } else {
        if ($Name -eq "Reticulum Dependencies") {
            # cannot detect reliably detect whether successful.
        } else {
            Write-Log "$Name installation failed."
            $global:failedInstalls += $Name
        }
    }
}

function Download-File {
    param (
        [string]$url,
        [string]$destination
    )

    Write-Host "Starting download..."

    # Try using BitsTransfer
    try {
        Write-Log "Using BitsTransfer..."
        Start-BitsTransfer -Source $url -Destination $destination
        Write-Host "Download completed." -ForegroundColor Green
        return
    } catch {
        Write-Log "BitsTransfer failed: $_" -ForegroundColor Red
    }

    # Try using WebClient if BitsTransfer fails
    try {
        Write-Log "Using WebClient..."
        $webClient = New-Object System.Net.WebClient
        $webClient.DownloadFile($url, $destination)
        Write-Host "Download completed." -ForegroundColor Green
        return
    } catch {
        Write-Host "WebClient failed: $_" -ForegroundColor Red
    }

    # Finally, try using Invoke-WebRequest if both above methods fail
    try {
        Write-Log "Using Invoke-WebRequest..."
        Invoke-WebRequest -Uri $url -OutFile $destination
        Write-Host "Download completed." -ForegroundColor Green
        return
    } catch {
        Write-Host "Invoke-WebRequest failed: $_" -ForegroundColor Red
        Write-Host "All download methods failed." -ForegroundColor Red
    }
}

function Extract-Zip {
    param (
        [string]$zipPath,
        [string]$destination
    )

    Write-Log "Attempting to extract using tar..."
    try {
        tar -xf $zipPath -C $destination
        Write-Log "Extraction completed using tar." -ForegroundColor Green
    } catch {
        Write-Log "tar extraction failed, falling back to Expand-Archive..." -ForegroundColor Yellow

        # Ensure destination directory exists
        if (!(Test-Path $destination)) {
            New-Item -ItemType Directory -Path $destination -Force | Out-Null
        }

        try {
            Expand-Archive -Path $zipPath -DestinationPath $destination -Force
            Write-Log "Extraction completed using Expand-Archive." -ForegroundColor Green
        } catch {
            Write-Log "Expand-Archive also failed: $_" -ForegroundColor Red
            exit 1
        }
    }
}



### START ###

Write-Host "We're now installing software required for VIA-VR. Please ensure you have a stable internet connection." -ForegroundColor Yellow
Write-Host "IMPORTANT: Follow all instructions carefully and confirm prompts by pressing 'Y' and Enter when asked." -ForegroundColor Yellow
Write-Host "This process may take a while. Please do not close any pop-up windows." -ForegroundColor Yellow
$null = $Host.UI.RawUI.FlushInputBuffer()   # prevents previous repeated enter presses to skip pause
Pause

if (-not (Check-Admin)) {
    Write-Host "Script is not running as administrator. Restarting with administrator rights, please confirm the prompt." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.FlushInputBuffer()   # prevents previous repeated enter presses to skip pause
    Pause
    Relaunch-AsAdmin
} else {
    Write-Host "Script is running as administrator." -ForegroundColor Green
    Write-Log "Script is running as administrator."
}

if (![string]::IsNullOrEmpty($WorkingDir)) {
    Set-Location $WorkingDir
}

Write-Log "Installation process started."
Start-Transcript -Path "C:\viavr-install-transcript.log" -Append

### GIT ###
Install-Software -Name "Git" -InstallScript {
    & "$PWD\dependenciesScripts\Git\gitInstaller.ps1"

    # Check if Git is in PATH after installation
    $gitPath = "C:\Program Files\Git\cmd"
    if (!(Get-Command git -ErrorAction SilentlyContinue)) {
        Write-Log "Git not found in PATH. Adding it..."
        [System.Environment]::SetEnvironmentVariable("Path", $env:Path + ";$gitPath", [System.EnvironmentVariableTarget]::Machine)
    }
} -CheckInstalled {
    Test-Path "C:\Program Files\Git\cmd\git.exe"
}

### NODE ###
$nodeAvailable = $true
Install-Software -Name "Node.js" -InstallScript {
    & "$PWD\dependenciesScripts\Node\nodeInstaller.ps1"
    Write-Host "Press enter to continue."
    
    # Add Node.js to the PATH
    $nodePath = "C:\Program Files\nodejs"
    if (!(Test-Path $nodePath)) {
        Write-Host "Node.js installation directory not found at $nodePath. Ensure Node.js installed correctly." -ForegroundColor Red
        Write-Log "Node.js not found in path after installation."
        $global:failedInstalls += "Node.js"
        $nodeAvailable = $false
    }
    else {
        # Update PATH in the current session
        $env:Path += ";$nodePath"

        # Persist PATH update for future sessions
        [System.Environment]::SetEnvironmentVariable("Path", $env:Path, [System.EnvironmentVariableTarget]::Machine)

        # Verify installation
        node -v
    }
} -CheckInstalled {
    if (Check-Command -command "node -v") {
        $nodeVersion = node -v 2>$null
        if ($nodeVersion -match "^v22\.") {
            return $true
        } elseif ($nodeVersion) {
            Write-Host "Detected Node.js version: $nodeVersion. Please uninstall it and rerun the installer." -ForegroundColor Red
            $null = $Host.UI.RawUI.FlushInputBuffer()   # prevents previous repeated enter presses to skip pause
            Pause
            exit
        }
        return $false
    } else {
        return $false
    }
}

### YARN ###
if ($nodeAvailable) {
    Install-Software -Name "Yarn" -InstallScript {
        Write-Host "Yarn is not accessible. Trying to enable corepack..." -ForegroundColor Yellow
        Write-Host "Please press enter to install yarn." -ForegroundColor Yellow
        corepack enable
        yarn -v
    } -CheckInstalled {
        Write-Host "Please press enter to continue." -ForegroundColor Yellow
        Check-Command -command "yarn -v"
    }
}

### Reticulum Dependencies ###
Install-Software -Name "Reticulum Dependencies" -InstallScript {
    Push-Location ".\plugins\viavr-reticulum\"
    & ".\run_check_install.ps1"
    Pop-Location
} -CheckInstalled {
    $false  # No reliable way to check this; always run
}

### Visual Studio ###
Install-Software -Name "Visual Studio" -InstallScript {
    & "$PWD\dependenciesScripts\VSC\vscInstaller.ps1"
} -CheckInstalled {
    Test-Path "C:\Program Files (x86)\Microsoft Visual Studio\Installer\vswhere.exe"
}

### Unity Hub ###
Install-Software -Name "Unity Hub" -InstallScript {
    $unityHubInstaller = "$env:TEMP\UnityHubSetup.exe"
    $unityHubURL = "https://downloads.games.informatik.uni-wuerzburg.de/via-vr/vendor/unity/UnityHubSetup.exe"

    # Download Unity Hub installer
    Write-Host "Downloading Unity Hub..."
    Download-File -url $unityHubURL -destination $unityHubInstaller

    # Run the installer silently and wait for completion
    Write-Host "Installing Unity Hub..."
    Start-Process -FilePath $unityHubInstaller -ArgumentList "/S" -Wait
    Write-Host "Unity Hub installation completed." -ForegroundColor Green
} -CheckInstalled {
    Test-Path "C:\Program Files\Unity Hub\Unity Hub.exe"
}

### Unity ###
Install-Software -Name "Unity" -InstallScript {
    $unityPluginsDir = "$PWD\plugins\unity"

    # Ensure the directory exists
    if (!(Test-Path $unityPluginsDir)) {
        New-Item -ItemType Directory -Path $unityPluginsDir -Force | Out-Null
    }
    
    # List of files to download
    $filesToDownload = @(
        @{ url = "https://downloads.games.informatik.uni-wuerzburg.de/via-vr/vendor/unity/AndroidPlayer.zip"; destination = "$unityPluginsDir\AndroidPlayer.zip" },
        @{ url = "https://downloads.games.informatik.uni-wuerzburg.de/via-vr/vendor/unity/UnitySetup64-2021.3.31f1.exe"; destination = "$unityPluginsDir\UnitySetup64-2021.3.31f1.exe" },
        @{ url = "https://downloads.games.informatik.uni-wuerzburg.de/via-vr/vendor/unity/UnitySetup-Android-Support-for-Editor-2021.3.31f1.exe"; destination = "$unityPluginsDir\UnitySetup-Android-Support-for-Editor-2021.3.31f1.exe" }
    )

    # Download files
    foreach ($file in $filesToDownload) {
        Download-File -url $file.url -destination $file.destination
    }

    Write-Host "Installing Unity. This will take a while, please wait..."

    # Install Unity Editor silently and wait for completion
    Start-Process -FilePath "$PWD\plugins\unity\UnitySetup64-2021.3.31f1.exe" -ArgumentList "/S" -Wait

    # Install Android Support for Unity Editor silently and wait for completion
    Write-Host "Installing Android support for Unity..."
    Write-Log "Installing Android support for Unity..."
    Start-Process -FilePath "$PWD\plugins\unity\UnitySetup-Android-Support-for-Editor-2021.3.31f1.exe" -ArgumentList "/S" -Wait

    
    # Define extraction path
    Write-Host "Installing Android build tools for Unity..."
    Write-Log "Installing Android build tools for Unity..."
    $androidPlayerPath = "C:\Program Files\Unity 2021.3.31f1\Editor\Data\PlaybackEngines\AndroidPlayer"

    # Ensure destination directory exists
    if (!(Test-Path $androidPlayerPath)) {
        New-Item -ItemType Directory -Path $androidPlayerPath -Force | Out-Null
    }

    # Extract AndroidPlayer.zip to the correct location and wait for completion
    # Ensure destination directory exists
    if (!(Test-Path $androidPlayerPath)) {
        New-Item -ItemType Directory -Path $androidPlayerPath -Force | Out-Null
    }
    Extract-Zip -zipPath "$PWD\plugins\unity\AndroidPlayer.zip" -destination $androidPlayerPath
    Write-Log "Unity installed"

} -CheckInstalled {
    (Test-Path "C:\Program Files\Unity 2021.3.31f1\Editor\Unity.exe") -or (Test-Path "C:\Program Files\Unity\Hub\Editor\Unity 2021.3.31f1\Editor\Unity.exe")
}

### Unity License ###
Write-Host ""
Write-Host "For VIA-VR to work you need a Unity account and a valid license. I'll now start the Unity Hub." -ForegroundColor Yellow
Write-Host "Please sign in or create an account. You do not have to install Unity." -ForegroundColor Yellow
Write-Host "Once logged in, go to preferences -> licenses and make sure you have a valid license (e.g. a free personal license)." -ForegroundColor Yellow
Write-Host "Should anything go wrong please quit Unity Hub (also righ-click it in the system tray and selct 'quit Unity Hub'). You can then manually try again to start the Unity Hub, login, and get a license."
$null = $Host.UI.RawUI.FlushInputBuffer()   # prevents previous repeated enter presses to skip pause
Pause
Start-Process -RedirectStandardOutput "null" -FilePath "C:\Program Files\Unity Hub\Unity Hub.exe"
Write-Host ""
Write-Host "Please press enter and continue once you have a valid Unity license."
$null = $Host.UI.RawUI.FlushInputBuffer()   # prevents previous repeated enter presses to skip pause
Pause

Write-Host "Starting and stopping Unity once. You don't have to do anything. You should not get any license error. If you do please check your license as mentioned above." -ForegroundColor Yellow
Start-Process -FilePath "C:\Program Files\Unity 2021.3.31f1\Editor\Unity.exe"
Start-Sleep -Seconds 20 # Wait a few seconds (allows Unity to initialize)
$process = Get-Process | Where-Object { $_.Path -eq "C:\Program Files\Unity 2021.3.31f1\Editor\Unity.exe" }
if ($process) {
    Stop-Process -Id $process.Id -Force
}

### COMPLETION ###
if ($failedInstalls.Count -gt 0) {
    Write-Host "The following installations failed: $($failedInstalls -join ', ')" -ForegroundColor Red
    Write-Host "Please retry running the script or manually install the missing software." -ForegroundColor Yellow
    Write-Log "Failed installations: $($failedInstalls -join ', ')"
}

Write-Host "Installation complete. Press Enter to exit." -ForegroundColor Green
Write-Log "Installation process completed."
Stop-Transcript

$null = $Host.UI.RawUI.FlushInputBuffer()   # prevents previous repeated enter presses to skip pause
Pause
