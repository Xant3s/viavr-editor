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

#Unity hub variables
$unityHubPath = "C:\Program Files\Unity Hub\Unity Hub.exe"

Write-Host ""
Write-Host "Installing unity version 2021.3.31f1 through Unity Hub ... " -ForegroundColor Cyan
Write-Host "If the installation process appears to be stuck, try pressing Enter after waiting for a while." -ForegroundColor Cyan
Start-Process -FilePath "$unityHubPath" -ArgumentList `
"-- --headless install --version 2021.3.31f1 --changeset 3409e2af086f" -Wait
Write-Host "Finished installing Unity through Unity Hub" -ForegroundColor Green
Write-Host ""
Write-Host "Adding required andriod build tools through Unity Hub ... " -ForegroundColor Cyan
Write-Host "If the installation process appears to be stuck, try pressing Enter after waiting for a while." -ForegroundColor Cyan
Start-Process -FilePath "$unityHubPath" -ArgumentList `
"-- --headless install-modules --version 2021.3.31f1 --module android android-sdk-ndk-tools android-open-jdk-8u172-b11" -Wait

Set-Location $currentPath
Write-Host "Unity installation complete!" -ForegroundColor Green
