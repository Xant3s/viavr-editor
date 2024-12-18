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
$workloads = "--add Microsoft.VisualStudio.Workload.ManagedDesktop --add Microsoft.VisualStudio.Workload.NetWeb --add Microsoft.VisualStudio.Workload.Game"


# Download Git Installer
if (-not (Test-Path $vsInstaller)) {
    Invoke-WebRequest -Uri $vsInstallerUrl -OutFile $vsInstaller -UseBasicParsing
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