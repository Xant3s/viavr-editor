# Get the current directory
$currentPath = (Get-Location).Path
$folderName = "dependenciesScripts\Unity"
# Check if the current path does not end with "Unity"
if (-not ($currentPath -like "*\$folderName")) 
{
    Set-Location -Path "$folderName\"
    Write-Host "Changed directory to $folderName" -ForegroundColor Green
} 
else 
{
    Write-Host "Already in the $folderName directory" -ForegroundColor Yellow
}


# Define Unity 2021.3.31f Installer download URL
$unityInstallerUrl = "https://download.unity3d.com/download_unity/3409e2af086f/Windows64EditorInstaller/UnitySetup64-2021.3.31f1.exe"
# Andriod build module
$unityAndriodInstallerUrl = "https://download.unity3d.com/download_unity/3409e2af086f/TargetSupportInstaller/UnitySetup-Android-Support-for-Editor-2021.3.31f1.exe"
# Define download and installation paths
$unityInstaller = "unity2021.exe"
$unityAndriodInstaller = "unity2021Andriod.exe"

# Download Unity Installer
if (-not (Test-Path $unityInstaller)) {
    Write-Host "Starting Unity download. If the script dosent continue automatically due to the long downloadtime please press enter after the download is finished to continue." -ForegroundColor Yellow
    Start-BitsTransfer -Source $unityInstallerUrl -Destination $unityInstaller 
    Write-Host "Downloaded Unity installer" -ForegroundColor Green
} else {
    Write-Host "Unity installer already exists" -ForegroundColor Cyan
}
# Download Unity Installer
if (-not (Test-Path $unityAndriodInstaller)) {
    Start-BitsTransfer -Source $unityAndriodInstallerUrl -Destination $unityAndriodInstaller 
    Write-Host "Downloaded Unity Andriod installer" -ForegroundColor Green
} else {
    Write-Host "Andriod Unity installer already exists" -ForegroundColor Cyan
}

# Install Unity
Write-Host "Installing unity passively..." -ForegroundColor Cyan
Write-Host "If the script dosent continue automatically due to the long installation time please press enter after the installation is finished to continue." -ForegroundColor Cyan
Start-Process -FilePath "./$unityInstaller" -ArgumentList `
"/S" -Wait

# Install Unity andriod
Write-Host "Installing andriod build module passively..." -ForegroundColor Cyan
Write-Host "If the script dosent continue automatically due to the long installation time please press enter after the installation is finished to continue." -ForegroundColor Cyan
Start-Process -FilePath "./$unityAndriodInstaller" -ArgumentList `
"/S" -Wait

Set-Location $currentPath
Write-Host "Unity installation complete!" -ForegroundColor Green