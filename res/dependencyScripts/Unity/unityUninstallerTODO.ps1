# Get the current directory
$currentPath = (Get-Location).Path

# Check if the current path does not end with "Node"
if (-not ($currentPath -like "*\Node")) 
{
    # Change to the Node directory
    Set-Location -Path "Node\"
    Write-Host "Changed directory to Node" -ForegroundColor Green
} 
else 
{
    Write-Host "Already in the Node directory" -ForegroundColor Yellow
}


# Step: Downloading Node
$nodeVersion = "v22.11.0" #https://nodejs.org/dist/
$nodeMSIPackage = "node-$nodeVersion-x64.msi"
$nodeDownloadUrl = "https://nodejs.org/dist/$nodeVersion/$nodeMSIPackage"
$nodeInstallerPath = ".\$nodeMSIPackage"
$installDir = "C:\Program Files\nodejs"
if (Test-Path "$nodeInstallerPath")
{
    Write-Host "Uninstaller already downloaded. Proceed to uninstallation" -ForegroundColor Yellow
}
else
{
    try
    {
        Invoke-WebRequest -Uri $nodeDownloadUrl -OutFile $nodeInstallerPath -UseBasicParsing
    }catch
    {
        Write-Host "Failed to Download Node Uninstaller. Aborting..." -ForegroundColor Red
        return
    }
    Write-Host "Download successfull." -ForegroundColor Green
}

# Install Node.js silently
Write-Host "Uninstalling Node.js silently..." -ForegroundColor Cyan
Start-Process msiexec.exe -ArgumentList "/x `"$PWD\$nodeMSIPackage`" /qr INSTALLDIR=`"$installDir`""  -Wait

# Check if Node.js was installed
if (Test-Path "$installDir\node.exe") {
    Write-Host "Node.js uninstallation failed." -ForegroundColor Red
    exit 1
} else {
    Write-Host "Node.js was uninstalled successfully!" -ForegroundColor Green
}