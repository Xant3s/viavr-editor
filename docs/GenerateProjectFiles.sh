#!/bin/bash

# Public Variables

# When changing the value of MainContentDirectory, make sure to also change the name inside 
# "templates\VIA_VR\styles\addDropdown.js"
# Make sure the following names match the directory names
MainContentDirectory="specifications"
ImageFolderName="images"

# Add another content directory
# APIContentDirectory="Api"

# ---------------------------------------------
# Private variables
currentDirectory=$(pwd)
TocFile="toc.yml"
DocfxTemplate="docfx.json.template"
DocfxFile="docfx.json"

echo "Removing outdated files"
# Delete outdated files
rm -rf _site
rm -rf obj/.cache
rm -f $DocfxFile

echo "Create main top.yml file"
# Create top.yml file, make latest version the default
latestVersionFolderName=$(ls -1 $MainContentDirectory | tail -n 1)
topYmlContent="
- name : $MainContentDirectory
  href : $MainContentDirectory/$latestVersionFolderName/
"
# To add another Content Directory
# - name : $APIContentDirectory
#  href : $APIContentDirectory/
#  homepage: $APIContentDirectory/index.md
if [ -f "${TocFile}" ]; then
  continue
  else
  echo "$topYmlContent" > $TocFile
fi

echo "Create content top.yml files"
# Generate a toc.yml file for each version
Versions=($(ls -d $MainContentDirectory/*/))

for version in "${Versions[@]}"
do
  if [ -f "${version}/${TocFile}" ]; then
    continue
  fi

  GeneratedTocYML=""
  TopicsFolder=($(ls -d ${version}*/))
  ymlContent=""
  for topic in "${TopicsFolder[@]}"
  do
    documents=$(find ${MainContentDirectory}/${version}/${topic} -maxdepth 1 -name "*.md" -type f)
    if [ $(echo $documents | wc -w) -gt 1 ]
    then
      ymlContent+="
- name : $topic
  items:

"
      for article in $documents
      do
        articleName=$(basename -s .md "$article")
        ymlContent+="
  - name : $articleName
    href : $topic/$article

"
      done
    else
      ymlContent+="
- name : $topic
  href : $topic/$(basename $documents)

"
    fi
  done
  echo "$ymlContent" > "${version}/${TocFile}"
done

echo "Create docfx.json from template"
# Insert content to docfx.json 
DocfxContent=""

# To add another content directory set DocfxContent default to this
# {
#   "files": 
#   [
#     "$APIContentDirectory/**.yml",
#     "$APIContentDirectory/index.md"
#   ]
# }
# 


# Add versions into docfx.json
for version in "${Versions[@]}"
do
  DocfxContent+="
{
  \"files\": 
  [
    \"$version**.md\",
    \"$version**/$TocFile\",
    \"$TocFile\",
    \"*.md\"
  ]
},
"
done

FolderPaths="
\"$ImageFolderName/**\",
\"$MainContentDirectory/**/$ImageFolderName/**\"
"

docfxJsonContent=$(cat $DocfxTemplate)
ModifiedJson="${docfxJsonContent/\%1/$DocfxContent}"
ModifiedJson="${ModifiedJson/\%2/$FolderPaths}"
echo -e "$ModifiedJson" > $DocfxFile

echo "Generating Files Done."
echo "Run Docfx"

mono ./docfx/docfx.exe docfx.json build
# ./docfx/docfx docfx.json build

scriptDir="$(dirname "$0")"
articlesDir="$scriptDir/$MainContentDirectory"
outputFile="$scriptDir/_site/files.json"

echo "[" > "$outputFile"

firstFile=true
find "$articlesDir" -type f -name "*.md" -print0 | tac -s $'\0' | while IFS= read -r -d $'\0' file; do
    relMdPath="${file#$articlesDir/}"
    relHtmlPath=$(echo "$relMdPath" | sed 's/\.md$/.html/' | sed 's/\//\\\\/g')

    if [ "$firstFile" = false ]; then
        echo "," >> "$outputFile"
    fi

    echo "\"$relHtmlPath\"" >> "$outputFile"

    firstFile=false
done

echo "]" >> "$outputFile"