function Download-File {
    param (
        [string]$url,
        [string]$destination
    )

    Write-Host "Attempting to download from: $url"

    # Try using BitsTransfer
    try {
        Write-Host "Using BitsTransfer..."
        Start-BitsTransfer -Source $url -Destination $destination
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
$folderName = "dependenciesScripts\Node"
# Check if the current path does not end with "Node"
if (-not ($currentPath -like "*\$folderName")) 
{
    Set-Location -Path "$folderName\"
    Write-Host "Changed directory to $folderName" -ForegroundColor Green
} 
else 
{
    Write-Host "Already in the $folderName directory" -ForegroundColor Yellow
}


# Step: Downloading Node
$nodeVersion = "v22.11.0" #https://nodejs.org/dist/
$nodeMSIPackage = "node-$nodeVersion-x64.msi"
$nodeDownloadUrl = "https://nodejs.org/dist/$nodeVersion/$nodeMSIPackage"
$installDir = "C:\Program Files\nodejs"
if (Test-Path "$nodeMSIPackage")
{
    Write-Host "Installer already downloaded. Proceed to installation" -ForegroundColor Yellow
}
else
{
    try
    {
        Download-File -url $nodeDownloadUrl -destination $nodeMSIPackage
    }catch
    {
        Write-Host "Failed to Download Node. Aborting..." -ForegroundColor Red
        return
    }
    Write-Host "Download successfull." -ForegroundColor Green
}
# Install Node.js passively
Write-Host "Installing Node.js passively..." -ForegroundColor Cyan
Start-Process msiexec.exe -ArgumentList "/i `"$PWD\$nodeMSIPackage`" /qr INSTALLDIR=`"$installDir`""  -Wait
Set-Location $currentPath
# Check if Node.js was installed
if (Test-Path "$installDir\node.exe") {
    Write-Host "Node.js was installed successfully!" -ForegroundColor Green
} else {
    Write-Host "Node.js installation failed." -ForegroundColor Red
    exit 1
}