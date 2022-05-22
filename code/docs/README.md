We use DocFX for generating the documentation. You can publish your markdown files there and it supports C#-API Documentation.

# How to host the VIA-VR example documentation page
1. Download and install [docfx](https://dotnet.github.io/docfx/index.html) via one of the following sources
    - Via [Chocolatey](https://community.chocolatey.org/packages/docfx). You need to install Chocolatey first which is a package manager for Windows.
       Installation details [here](https://chocolatey.org/install). Run `choco install docfx` in the Shell and docfx should be installed. 

    - GitHub: download and unzip docfx.zip from [here](https://github.com/dotnet/docfx/releases), extract it to a local folder, and add it to PATH so you can run it anywhere.
  
2. Run this command: `docfx docfx_project\docfx.json --serve` inside the `documentation-example` directory.
    You should now be able to view the generated site on http://localhost:8080.

Additional info on the possible install methods can be found [here](https://dotnet.github.io/docfx/tutorial/docfx_getting_started.html)

 
## Adding new Articles
- In the `\articles` directory create a new folder for the Package you want to publish docs for.
- Add your `.md` files for each version.
- Copy the html code for the dropdown menu in the given example articles and change accordingly.
- You now also have to edit the `toc.yml` in the `\articles` directory, so the article will show up on the sidebar. Add `name:` and `href:` accordingly.

