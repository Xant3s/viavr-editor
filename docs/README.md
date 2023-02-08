We use DocFX for generating the documentation. You can publish your markdown files there and it supports C#-API Documentation.

# Install DocFX

1. Download and install [docfx](https://dotnet.github.io/docfx/index.html) via one of the following sources
    - Via [Chocolatey](https://community.chocolatey.org/packages/docfx). You need to install Chocolatey first which is a package manager for Windows.
       Installation details [here](https://chocolatey.org/install). Run `choco install docfx` in the Shell and docfx should be installed. 

    - GitHub: download and unzip docfx.zip from [here](https://github.com/dotnet/docfx/releases), extract it to a local folder, and add it to PATH so you can run it anywhere.

2. When installing the docfx for the first time, execute the following command `dotnet tool update -g docfx`

# Generate Documentation With DocFX

Right click `GenerateProjectFiles.ps1` and select run with powershell. This will generate all necessary docfx files and will start a local server on `http://localhost:8080`

Additional info on the possible install methods can be found [here](https://dotnet.github.io/docfx/tutorial/docfx_getting_started.html)

 
## Adding New Articles

- Make sure to follow the folder structure:
```
.
└── Articles Folder/
    ├── Version_1 Folder/
    │   └── Topic_A Folder/
    │       ├── Markdown_1 File
    │       └── Markdown_2 File
    └── Version_2 Folder/
        └── Topic_A Folder/
            ├── Markdown_1 File
            └── Markdown_2 File
```
- Only add new files `.md` inside a topic folder
- The name of the topic folder will be displayed on the generated website
- If you have multiple files in a topic folder, also the names of the files (without extension) are displayed
- After you finish, execute the powershell file `GenerateProjectFiles.ps1` once again

## Adding New Versions

- You can add new versions by simply creating a new folder in the `Articles` directory
- The name of the folder will be the version on the generated website
- Follow the folder structure inside your new version folder (see above)
- Make sure that all previous versions have the **exact** same folder path (path begins after specific version folder)
	- If this is not the case, the user wont be able to select the different versions
- After you created a new version, re-execute the `GenerateProjectFiles.ps1` file

## ! Caution When Renaming Top Level Folder Names !

- When renaming the top level `Articles` folder, you need to update the changed name at 2 locations
	- Open the `GenerateProjectFiles.ps1` powershell script in a file editor and change in the public section the value of the `MainContentDirectory` variable to your new name
	- Open the the javascript file `templates\VIA_VR\styles\addDropdown.js` and update in the first line the `MainContentDirectory` constant to your new name
- When renaming the top level `Api` folder, you need to update the changed name at 1 location
	- Open the `GenerateProjectFiles.ps1` powershell script in a file editor and change in the public section the value of the `APIContentDirectory` variable to your new name

