# Public Variables

# When changing the value of MainContentDirectory, make sure to also change the name inside 
# "templates\VIA_VR\styles\addDropdown.js"
# Make sure the following names match the directory names
$MainContentDirectory = "specifications"
$ImageFolderName = "images"

# Add another content directory
#$APIContentDirectory = "Api"

# ---------------------------------------------
# Private variables
$currentDirectory = Get-Location
$TocFile = "toc.yml"
$DocfxTemplate = "docfx.json.template"
$DocfxFile = "docfx.json"

Write-Host Removing outdated files
# Delete outdated files
Remove-Item -Path "_site" -Recurse
Remove-Item -Path "obj/.cache" -Recurse
Remove-Item $TocFile
Remove-Item $DocfxFile

Write-Host Create main top.yml file
# Create top.yml file, make latest version the default
$latestVersionFolderName = Get-ChildItem -Path $MainContentDirectory | Select-Object -Last 1
$topYmlContent = @"
- name : $MainContentDirectory
  href : $MainContentDirectory/$latestVersionFolderName/
"@
# To add another Content Directory
#- name : $APIContentDirectory
#  href : $APIContentDirectory/
#  homepage: $APIContentDirectory/index.md

$topYmlContent | Out-File -FilePath $TocFile -Encoding UTF8

Write-Host Create content top.yml files
# Generate a toc.yml file for each version
$Versions = Get-ChildItem -Path $MainContentDirectory -Directory

foreach ($version in $Versions) {
    if (Test-Path $MainContentDirectory\$version\$TocFile) {
        continue
    }

    $GeneratedTocYML = ""
    $TopicsFolder = Get-ChildItem -Path $MainContentDirectory\$version -Directory
    $ymlContent = ""
    foreach ($topic in $TopicsFolder) {
        $documents = Get-ChildItem $MainContentDirectory\$version\$topic | Where-Object { $_.Extension -eq ".md" }
        if ($documents.Count -gt 1) {
            $ymlContent +=
            @"
- name : $topic
  items:

"@
            foreach ($article in $documents) {
                $articleName = $article.basename
                $ymlContent +=
                @"
  - name : $articleName
    href : $topic/$article

"@
            }
        }
        else {

            $ymlContent +=
            @"
- name : $topic
  href : $topic/$documents

"@
        }
    }
    $ymlContent | Out-File -FilePath $MainContentDirectory\$version\$TocFile -Encoding UTF8
}

Write-Host Create docfx.json from template
# Insert content to docfx.json 
$DocfxContent = ""

# To add another content directory set DocfxContent default to this
#@"
#{
#	"files": 
#	[
#		"$APIContentDirectory/**.yml",
#		"$APIContentDirectory/index.md"
#	]
#}
#"@


# Add versions into docfx.json
foreach ($version in $Versions) {
    $DocfxContent +=
    @"
{
	"files": 
	[
       "$MainContentDirectory/$version/**.md",
       "$MainContentDirectory/$version/**/$TocFile",
       "$TocFile",
       "*.md"
	]
}
,
"@
}

$FolderPaths =

@"
"$ImageFolderName/**",
"$MainContentDirectory/**/$ImageFolderName/**"

"@

$docfxJsonContent = Get-Content -Path $DocfxTemplate -Raw
$ModifiedJson = $docfxJsonContent -replace "%1", "$DocfxContent"
$ModifiedJson = $ModifiedJson -replace "%2", "$FolderPaths"
Set-Content -Path $DocfxFile -Value $ModifiedJson

Write-Host Generating Files Done.
Write-Host Run Docfx

docfx docfx.json

# Prints a JSON array of all the HTML files in the Articles directory to the files.json file.
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$articlesDir = Join-Path $scriptDir $MainContentDirectory
$outputFile = Join-Path $scriptDir "_site/files.json"

Get-ChildItem -Path $articlesDir -Recurse -Filter *.md | ForEach-Object {
    $relMdPath = $_.FullName.Substring($articlesDir.Length + 1)
    $relHtmlPath = $relMdPath -replace "\.md$", ".html"
    $relHtmlPath
} | ConvertTo-Json | Out-File -Encoding utf8 $outputFile


docfx docfx.json --serve