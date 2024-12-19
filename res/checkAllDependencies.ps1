###Variabels###
$nodePath = "C:\Program Files\nodejs"

$vscPath = "C:\Program Files (x86)\Microsoft Visual Studio"

$unityRecVersion = "2021.3.31f1"
$unityPath = "C:\Program Files\Unity $unityRecVersion"
$unityHubPath = "C:\Program Files\Unity Hub"

$cygwinPath = "C:\cygwin64"
$postgresPath = "C:\Program Files\PostgreSQL\16\bin"
$postgresPort = 5432

$EditorPath = Split-Path $PSScriptRoot -Parent
$SpokePath = Join-Path $EditorPath "res\plugins\spoke\node_modules"
$NearSparkPath = Join-Path $EditorPath "res\plugins\viavr-nearspark\node_modules"
$ReticulumPath = Join-Path $EditorPath "res\plugins\viavr-reticulum\_build"
$EditorPath = Join-Path $EditorPath "\node_modules"
$Paths = @{
    "Editor"      = $EditorPath
    "Spoke"       = $SpokePath
    "NearSpark"   = $NearSparkPath
    "Reticulum"   = $ReticulumPath
}


###Functions###
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
function Check-Port {
    param (
        [int]$port
    )

    $portOpen = Test-NetConnection -ComputerName "localhost" -Port $port -InformationLevel Quiet
    if ($portOpen) {
        return $true
    } 
    else {
        return $false
    }
}
Write-Host "Note:" -ForegroundColor Yellow 
Write-Host "This script will search for folders mainly on the C:\ drive. If some dependencies are 
installed on another drive, the script won't detect them." -ForegroundColor Cyan
Write-Host ""
Write-Host "If you want to change the location where the script checks for folders, please adjust the 
variables at the beginning of the script." -ForegroundColor Cyan
Write-Host ""
Pause 
Write-Host "### Editor ###" -ForegroundColor Yellow
#Node 
Write-Host ""
Write-Host "Node:" -ForegroundColor Cyan
if (Test-Path "$nodePath")
{
    Write-Host "$nodePath exists." -ForegroundColor Green
}
else
{
    Write-Host "$nodePath dosent exists." -ForegroundColor Red 
}
if(Check-Command -command "node --version")
{
    $nodeInstalledVersion = node --version
    Write-Host "Node is available in PATH. Version $nodeInstalledVersion" -ForegroundColor Green
}
else
{
    Write-Host "Node is not available in PATH." -ForegroundColor Red
}
#Yarn 
Write-Host ""
Write-Host "Yarn:" -ForegroundColor Cyan
if(Check-Command -command "yarn -v")
{
    Write-Host "Yarn is accessible in PATH." -ForegroundColor Green
}
else
{
    Write-Host "Couldnt find yarn in PATH. " -ForegroundColor Red
}

#Visual Studio
Write-Host ""
Write-Host "Visual Studio:" -ForegroundColor Cyan
if (Test-Path "$vscPath")
{
    Write-Host "$vscPath exists." -ForegroundColor Green
    $vswhere = "$vscPath\Installer\vswhere.exe"
    $vsVersion = & $vswhere -latest -products * -property installationVersion
    Write-Host "The installed visual studio version is $vsVersion.(15=VSC2017 16=VSC2019 17=VSC2022)" -ForegroundColor Green
}
else
{
    Write-Host "$vscPath dosent exists." -ForegroundColor Red 
}
#Unity
Write-Host ""
Write-Host "Unity:" -ForegroundColor Cyan
if (Test-Path "$unityPath")
{
    Write-Host "$unityPath exists." -ForegroundColor Green
}
else
{
    Write-Host "$unityPath dosent exists." -ForegroundColor Red
    if(Test-Path "$unityHubPath")
    {
        Write-Host "But $unityHubPath exists. Maybe some other Unity version was already installed on the System." -ForegroundColor Yellow
        Write-Host "The Unity version recommended for viavr is: $unityRecVersion" -ForegroundColor Yellow
        Write-Host "If using another Unity version please make sure the Andriod build tools are installed." -ForegroundColor Yellow
    }
}

Write-Host ""
Pause 
Write-Host "### Reticulum ###" -ForegroundColor Yellow

#Cygwin
Write-Host ""
Write-Host "Cygwin:" -ForegroundColor Cyan
if (Test-Path "$cygwinPath")
{
    Write-Host "$cygwinPath exists." -ForegroundColor Green
    $env:Path += ";C:\cygwin64\bin"
    if(Check-Command -command "df")
    {
        Write-Host "The Cygwin command df could be started from PATH." -ForegroundColor Green
    }
    else
    {
        Write-Host "The Cygwin command df couldnt be started from PATH." -ForegroundColor Red
    }
    
}
else
{
    Write-Host "$cygwinPath dosent exists." -ForegroundColor Red 
}
#Postgres
Write-Host ""
Write-Host "Postgres:" -ForegroundColor Cyan
if (Test-Path "$postgresPath")
{
    Write-Host "$postgresPath exists." -ForegroundColor Green
    if(Check-Port -port $postgresPort)
    {
        Write-Host "Postgresport localhost:$postgresPort is accessible." -ForegroundColor Green
    }
    else
    {
        Write-Host "Postgresport localhost:$postgresPort is not accessible." -ForegroundColor Red
    }
    
}
else
{
    Write-Host "$cygwinPath dosent exists." -ForegroundColor Red 
}
#Elixir
Write-Host ""
Write-Host "Elixir/Erlang:" -ForegroundColor Cyan
$installs_dir = "$env:USERPROFILE\.elixir-install\installs"
$env:PATH = "$env:USERPROFILE\.elixir-install\installs\otp\23.3.4.20\bin;$env:PATH"
$env:PATH = "$env:USERPROFILE\.elixir-install\installs\elixir\1.14.3-otp-23\bin;$env:PATH"
if(Check-Command -command "elixir --version")
{
    $elixirVersion = elixir --version
    Write-Host "Elixir available in PATH version: $elixirVersion." -ForegroundColor Green
}
else
{
    Write-Host "Elixir not available in PATH." -ForegroundColor Red
}
#Folders:
Write-Host ""
Pause 
Write-Host "### Node/Reticulum modules/packages ###" -ForegroundColor Yellow
Write-Host ""
#Check if node_modules folder exist 
foreach ($Key in $Paths.Keys) {
    $CurrentPath = $Paths[$Key]
    if (Test-Path $CurrentPath) {
        Write-Host "$Key" -ForegroundColor Cyan
        Write-Host "modules folder found:" -ForegroundColor Green
        Write-Host "$CurrentPath" -ForegroundColor Green
        Write-Host ""
    } else {
        Write-Host "$Key" -ForegroundColor Cyan
        Write-Host "modules folder not found:" -ForegroundColor Red
        Write-Host "$CurrentPath" -ForegroundColor Red
        Write-Host ""
    }
    
}
