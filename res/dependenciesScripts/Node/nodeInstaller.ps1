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
$nodeInstallerPath = ".\$nodeMSIPackage"
$installDir = "C:\Program Files\nodejs"
if (Test-Path "$nodeInstallerPath")
{
    Write-Host "Installer already downloaded. Proceed to installation" -ForegroundColor Yellow
}
else
{
    try
    {
        Start-BitsTransfer -Source $nodeDownloadUrl -Destination $nodeInstallerPath 
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