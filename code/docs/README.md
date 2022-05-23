# VIA-VR Editor Documentation

We use [DocFX](https://dotnet.github.io/docfx/) for generating the documentation.

## How to Build the Documentation Site

1. Install DocFX [see more](https://dotnet.github.io/docfx/tutorial/docfx_getting_started.html#2-use-docfx-as-a-command-line-tool)
2. Run `docfx ./docfx.json --serve` inside the `code/docs` folder. You should now be able to view the generated site on [http://localhost:8080](http://localhost:8080).
   1. Alternatively, run `docfx ./docfx.json` inside the `code/docs` folder and open the `code/docs/_site/index.html` file with any browser
   2. To delete the cache and rebuild via a single command, run the `CleanRebuild.bat` script

## Continuous Deployment

The documentation site is currently hosted [here](https://lectures.hci.informatik.uni-wuerzburg.de/viavr-docs/editor/). To publish a new version, push your changes to the master branch.

## Adding New Articles

- In the `\specifications` directory create a new folder for the Package you want to publish docs for
- Add your `.md` files for each version
- Copy the html code for the version dropdown menu in the given example articles and change accordingly
- You now also have to edit the `toc.yml` in the `\specifications` directory, so the article will show up on the sidebar. Add `name:` and `href:` accordingly

## Live Preview Workaround

To get a live preview you can use the following trick:

- Configure the 'run on save' VS Code extension to run the `CleanRebuild.bat` script when a .md file is modified
- Run `docfx ./docfx.json --serve` once and leave it open
- Navigate to http://localhost:8080 in Firefox
- Use the 'Tab Auto Refresh' Firefox extension