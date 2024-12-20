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

#Unity hub installer
$unityHubUrl = "https://public-cdn.cloud.unity3d.com/hub/prod/UnityHubSetup.exe"
$unityHubInstaller = "UnityHubSetup.exe"

# Download Unity Hub
if (-not (Test-Path $unityHubInstaller)) {
    Write-Host "Starting Unity Hub download. If the script dosent continue automatically due to the long downloadtime please press enter after the download is finished to continue." -ForegroundColor Yellow
    Start-BitsTransfer -Source $unityHubUrl -Destination $unityHubInstaller 
    Write-Host "Downloaded Unity Hub installer" -ForegroundColor Green
} else {
    Write-Host "Unity Hub installer already exists" -ForegroundColor Cyan
}

# Install Unity
Write-Host "Installing unity hub silently..." -ForegroundColor Cyan
Write-Host "If the script dosent continue automatically due to the long installation time please press enter after the installation is finished to continue." -ForegroundColor Cyan
Start-Process -FilePath "./$unityHubInstaller" -ArgumentList `
"/S" -Wait
Set-Location $currentPath
Write-Host "Finished installing Unity Hub" -ForegroundColor Green


