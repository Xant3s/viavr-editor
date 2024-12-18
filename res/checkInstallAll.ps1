#First make sure script is running as admin
param (
    [string]$WorkingDir
)
function Check-Admin 
{
    return ([bool](New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator))
}
function Relaunch-AsAdmin 
{
    Push-Location $PSScriptRoot
    $workingDir = (Get-Location).Path  
    $scriptPath = "$workingDir\checkInstallAll.ps1"
    Start-Process -FilePath "powershell.exe" `
                -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$scriptPath`" -WorkingDir `"$workingDir`"" `
                -Verb RunAs
    exit # Exit the current script to let the elevated instance handle the task
}
if (-not (Check-Admin)) 
{
    Write-Host "Script is not running as administrator. Restarting with administrator rights..." -ForegroundColor Red 
    Pause 
    Relaunch-AsAdmin # Relaunch with admin privileges if needed
}
else
{
    Write-Host "Script is running as administrator." -ForegroundColor Green
}
if (![string]::IsNullOrEmpty($WorkingDir)) {
    Set-Location $WorkingDir
} 
###Helper Functions Start###
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
###Helper Functions End###

### GIT ### Not used
#Define paths for git
<# $gitFolder = "C:\Program Files\Git\"
Push-Location #If the installer moves the script
Write-Host "Check if folder $gitFolder exists." -ForegroundColor Cyan
if (Test-Path "$gitFolder")
{
    Write-Host "Git folder exists." -ForegroundColor Green
}
else
{
    Write-Host "Git Path dosent exists. Trying to install git v2.47.1" -ForegroundColor Red 
    & "$PWD\Git\gitInstaller.ps1"
    if (Test-Path "$gitFolder")
    {
        Write-Host "Git folder exists now." -ForegroundColor Green
    }
    else
    {
        Write-Host "Something went wrong during the git installation please check the output. Exiting installation script..." -ForegroundColor Red
        Pause
        Exit 0
    }
} 
Write-Host "Checking if git is avialable in PATH " -ForegroundColor Cyan
if(Check-GitInstalled)
{
    Write-Host "Git is available in PATH." -ForegroundColor Green
}
else
{
    Write-Host "Git is not available in PATH. Setting PATH variable..." -ForegroundColor Red
    Write-Host "Adding git to PATH manually this time." -ForegroundColor Cyan
    $env:Path += ";$gitFolder\cmd"
    if(Check-GitInstalled)
    {
        Write-Host "Git is now available in PATH." -ForegroundColor Green
    }
    else
    {
        Write-Host "Couldnt set git to PATH aborting script ... " -ForegroundColor Red
        Pause
        Exit 0
    }
}
Pop-Location #go back to previous Folder if changed
#>
### NODE ###
# Define paths for node
$nodePath = "C:\Program Files\nodejs"  
$nodeInstalledVersion = ""
$nodeVersionInstalledByScript = "v22.11.0"
Push-Location

#Node
Write-Host ""
Write-Host "Check if folder $nodePath exists." -ForegroundColor Cyan
if (Test-Path "$nodePath")
{
    Write-Host "$nodePath exists." -ForegroundColor Green
}
else
{
    Write-Host "$nodePath does not exists. Checking if Node is available in PATH" -ForegroundColor Yellow 
    if(Check-Command -command "node --version")
    {
        #Skip installation if another Node is installed but not in the default Folder $nodePath
    }
    else
    {
        Write-Host "$nodePath dosent exist and node isnt available in PATH. Trying to install node version $nodeVersionInstalledByScript ..." -ForegroundColor Cyan
        & "$PWD\dependenciesScripts\Node\nodeInstaller.ps1"
        if (Test-Path "$nodePath")
        {
            Write-Host "Node Path exists now." -ForegroundColor Green
        }
        else
        {
            Write-Host "Something went wrong during the node installation please check the output. Exiting installation script..." -ForegroundColor Red
            Pause
            Exit 0
        }
    }
    
}
Write-Host ""
Write-Host "Checking if node is avialable in PATH " -ForegroundColor Cyan
if(Check-Command -command "node --version")
{
    $nodeInstalledVersion = node --version
    Write-Host "Node is available in PATH. Version $nodeInstalledVersion" -ForegroundColor Green
}
else
{
    Write-Host "Node is not available in PATH. Setting PATH variable..." -ForegroundColor Red
    Write-Host "Adding node to PATH manually this time." -ForegroundColor Cyan
    $env:Path += ";C:\Program Files\nodejs\"
    if(Check-Command -command "node --version")
    {
        $nodeInstalledVersion = node --version
        Write-Host "Node is available in PATH. Version $nodeInstalledVersion" -ForegroundColor Green
    }
    else
    {
        Write-Host "Couldnt set Node to PATH aborting script ... " -ForegroundColor Red
        Pause
        Exit 0
    }
}
if($nodeInstalledVersion -eq $nodeVersionInstalledByScript)
{
    Write-Host "Node Version matches the version installed by the installer" -ForegroundColor Green
}
else
{
    Write-Host "Node version dosent match the Version installed by the installer" -ForegroundColor Yellow
    Write-Host "Your current Version: $nodeInstalledVersion" -ForegroundColor Cyan
    Write-Host "Minimum Required Version: 22.x or higher." -ForegroundColor Cyan
}
#Yarn
Write-Host ""
Write-Host "Checking if yarn is accessible ... " -ForegroundColor Cyan
if(Check-Command -command "yarn -v")
{
    Write-Host "Yarn is installed" -ForegroundColor Green 
}
else
{
    Write-Host "Yarn isnt accessible. Trying to enable corepack ..." -ForegroundColor Yellow 
    Write-Host "!IMPORTANT! After 10seconds: due to a currently unresolved problem regarding corepack installation please input y in the console and press enter." -ForegroundColor Yellow
    corepack enable
    if(Check-Command -command "yarn -v")
    {
        Write-Host "Yarn is installed now" -ForegroundColor Green 
    }else
    {
        Write-Host "Yarn couldnt be installed correctly or isnt available in Path. Exiting Script ... " -ForegroundColor Red
        Pause 
        Exit 0
    }
}
Pop-Location
###VSC Installation###
Write-Host ""
Push-Location
$vscPath = "C:\Program Files (x86)\Microsoft Visual Studio"  
Write-Host "Check if folder $vscPath exists." -ForegroundColor Cyan
if (Test-Path "$vscPath")
{
    Write-Host "Visual Studio folder exists." -ForegroundColor Green
}
else
{
    Write-Host "Visual Studio path dosent exists. Trying to install visual studio" -ForegroundColor Red 
    & "$PWD\dependenciesScripts\VSC\vscInstaller.ps1"
    if (Test-Path "$vscPath")
    {
        Write-Host "Visual studio folder exists now." -ForegroundColor Green
    }
    else
    {
        Write-Host "Something went wrong during the visual studio installation please check the output. Exiting installation script..." -ForegroundColor Red
        Pause
        Exit 0
    }
}
#vswhere to check version
$vswhere = "$vscPath\Installer\vswhere.exe"
$vsVersion = & $vswhere -latest -products * -property installationVersion
$vsInfo = & $vswhere -latest -products * -format json | ConvertFrom-Json
Write-Host "The installed visual studio version is $vsVersion." -ForegroundColor Cyan
#checkModules?
Pop-Location

#Unity
Write-Host ""
Push-Location
$unityRecVersion = "2021.3.31f1"
$unityPath = "C:\Program Files\Unity $unityRecVersion"
$unityHubPath = "C:\Program Files\Unity Hub"
if (Test-Path "$unityPath")
{
    Write-Host "$unityPath exists." -ForegroundColor Green
}
elseif(Test-Path "$unityHubPath")
{
    Write-Host "But $unityHubPath exists. Maybe some other Unity version was already installed on the System." -ForegroundColor Yellow
    Write-Host "The Unity version recommended for viavr is: $unityRecVersion" -ForegroundColor Yellow
    # Ask the user a Y/N question
    $response = Read-Host "Do you want to download and install Unity 2021.3.31f1? (Y/N)"
    if ($response -match "^[Yy]$") {
        Write-Host "Starting Unity install script... " -ForegroundColor Cyan
        & "$PWD\dependenciesScripts\Unity\unityInstaller.ps1"
        if (Test-Path "$unityPath")
        {
            Write-Host "$unityPath exists." -ForegroundColor Green
        }
        else
        {
            Write-Host "$unityPath dosent exists. Please check the output. Exiting..." -ForegroundColor Red
            Pause
            Exit 0 
        }
    } elseif ($response -match "^[Nn]$") {
        Write-Host "Unityversion $unityRecVersion will not be installed." -ForegroundColor Yellow
        Write-Host "If using another Unity version please make sure the Andriod build tools are installed." -ForegroundColor Yellow
    } else {
        Write-Host "Unityversion $unityRecVersion will not be installed." -ForegroundColor Yellow
        Write-Host "If using another Unity version please make sure the Andriod build tools are installed." -ForegroundColor Yellow
    }
}
else
{
    Write-Host "$unityPath dosent exists." -ForegroundColor Red
    Write-Host "Executing unity installation script ... " -ForegroundColor Yellow
    & "$PWD\dependenciesScripts\Unity\unityInstaller.ps1"
    if (Test-Path "$unityPath")
    {
        Write-Host "$unityPath exists." -ForegroundColor Green
    }
    else
    {
        Write-Host "$unityPath dosent exists. Please check the output. Exiting..." -ForegroundColor Red
        Pause
        Exit 0 
    }

}
Write-Host ""
Write-Host "Dependency installation complete." -ForegroundColor Green
Write-Host "Please note the dependencies for Reticulum and nearspark are installed speretly through npm install." -ForegroundColor Green
Write-Host "If you want to check all the dependencies (including reticulum) please execute checkAllDependencies.ps1"  -ForegroundColor Green
Pause

