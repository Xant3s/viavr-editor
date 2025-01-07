# Get the directory of the current script
$currentDir = Split-Path -Path $MyInvocation.MyCommand.Definition

# Define the Git installer executable path
$gitInstaller = Join-Path -Path $currentDir -ChildPath "Git-2.47.1-64-bit.exe"

# Check if the Git installer exists
if (Test-Path $gitInstaller) {
    Write-Host "Found Git installer at $gitInstaller" -ForegroundColor Green

    # Run the installer with the /silent argument
    Start-Process -FilePath $gitInstaller -ArgumentList "/silent" -Wait -NoNewWindow

    Write-Host "Git installation process has completed." -ForegroundColor Green
} else {
    Write-Host "Git installer not found in the script directory!" -ForegroundColor Red
}
