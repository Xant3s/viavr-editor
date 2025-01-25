function Download-File {
    param (
        [string]$url,
        [string]$destination
    )

    Write-Host "Attempting to download from: $url"

    # Try using BitsTransfer
    try {
        Write-Host "Using BitsTransfer..."
        $transferJob = Start-BitsTransfer -Source $url -Destination $destination -Asynchronous
        Wait-BitsTransfer -BitsJob $transferJob
        Write-Host "Download completed using BitsTransfer." -ForegroundColor Green
        return
    } catch {
        Write-Host "BitsTransfer failed: $_" -ForegroundColor Red
    }

    # Try using WebClient if BitsTransfer fails
    try {
        Write-Host "Using WebClient..."
        $webClient = New-Object System.Net.WebClient
        $webClient.DownloadFile($url, $destination)
        Write-Host "Download completed using WebClient." -ForegroundColor Green
        return
    } catch {
        Write-Host "WebClient failed: $_" -ForegroundColor Red
    }

    # Finally, try using Invoke-WebRequest if both above methods fail
    try {
        Write-Host "Using Invoke-WebRequest..."
        Invoke-WebRequest -Uri $url -OutFile $destination
        Write-Host "Download completed using Invoke-WebRequest." -ForegroundColor Green
        return
    } catch {
        Write-Host "Invoke-WebRequest failed: $_" -ForegroundColor Red
        Write-Host "All download methods failed." -ForegroundColor Red
    }
}


# Get the current directory
$currentPath = (Get-Location).Path
$folderName = "dependenciesScripts\VSC"
# Check if the current path does not end with "VSC"
if (-not ($currentPath -like "*\$folderName")) 
{
    # Change to the Cygwin directory
    Set-Location -Path "$folderName\"
    Write-Host "Changed directory to $folderName" -ForegroundColor Green
} 
else 
{
    Write-Host "Already in the $folderName directory" -ForegroundColor Yellow
}


# Define Visual Studio Installer download URL
$vsInstallerUrl = "https://aka.ms/vs/17/release/vs_community.exe"
# Define download and installation paths
$vsInstaller = "vs_community.exe"
# Define workload for Unity
$workloads = "--add Microsoft.VisualStudio.Workload.ManagedDesktop --add Microsoft.VisualStudio.Workload.Game"


# Download Git Installer
if (-not (Test-Path $vsInstaller)) {
    try
    {
        Download-File -url $vsInstallerUrl -destination $vsInstaller
    }catch
    {
        Write-Host "Failed to Download Visual Studio. Aborting..." -ForegroundColor Red
        return
    }
    Write-Host "Downloaded Visual Studio installer" -ForegroundColor Green
} else {
    Write-Host "Visual Studio installer already exists" -ForegroundColor Cyan
}

# Install Visual Studio
Write-Host "Installing vs passively..." -ForegroundColor Cyan
Start-Process -FilePath "./$vsInstaller" -ArgumentList `
"--passive --wait --norestart --nocache $workloads" -NoNewWindow -Wait

Set-Location $currentPath
Write-Host "Visual Studio installation complete!" -ForegroundColor Green