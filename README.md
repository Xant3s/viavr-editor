# VIA-VR Editor

## Documentation

See [https://go.uniwue.de/viavr-docs](https://go.uniwue.de/viavr-docs)

## Prerequisites

- Make sure to clone recursively, i.e. including all submodules
- Make sure [node.js](https://nodejs.org/en/download/) 16.x is installed. Spoke does not support Node versions newer than 16.x (e.g. 17.x)
- Make sure Python [(version 3.8 or 3.9)](https://www.python.org/ftp/python/3.8.0/python-3.8.0-amd64.exe) is installed. The recommender system requires Python.

  - To check that Node.js was installed correctly, type the following commands in your terminal client:

    ```bash
    node -v
    npm -v
    ```
  - Node >=16.10 will include Corepack, which includes [Yarn](https://yarnpkg.com/). To enable Corepack, run as administrator:

    ```bash
    corepack enable
    ```

  - To check that Yarn was installed correctly, type the following command in your terminal client:

    ```bash
    yarn -v
    ```

- Make sure Unity 2021.3.31f1 is installed
- Make sure your internet connection is working properly
- If you want to use articy:draft, make sure it's installed

## Required Ports

- 3000
- 9090

## How to Start (Currently Only Tested on Windows)

- We recommend doing the following steps in cmd.exe
- Run the following command to install the recommender system
  - `npm run install:rs-server`
- Run the following commands to install the application:
  - `npm install`
- Run the following command to start the application
  - `npm start`

## How to Start Only the Frontend

When developing a new UI window, it can be useful to just start the frontend to view the result. This will be considerably faster than also starting the backend. It also comes with faster hot-reloading. When starting just the frontend you will not be able to fetch data from the backend, so only use this when working with dummy data.

- Run the following commands:
  - Run `npm install`
  - Run `npm start:frontend`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits. You will also see any lint errors in the console. Navigate to subpages using the `#/` notation (e.g. `http://localhost:3000#/hello-world`).

## How to Build Executable (Currently Windows Only)

- Run the following commands:
  - Run `npm install`
  - Run `npm run package` to build an executable for your system
- Install [Yarn](https://yarnpkg.com/) on the target PC
- Copy the setup executable from the `dist` folder to the target PC
- Run the setup executable on the target PC

## How to Run Unit Tests

Currently, only the backend has unit tests. `electron-is-dev` is incompatible with unit tests.

- Run the following commands:
  - Run `npm install`
  - Run `npm test`

## How to Use the Application

- Start the application
  - Do not close any terminal windows that appear
- Select 'Open Project'
  - Open the example project we provide at "RepoRoot/res/ExampleProject.via"
  - You may see a white screen for a few seconds while Spoke is still starting
- Check your preferences
  - Go to File > Preferences
  - Check the path to the Unity executable
  - Check the path to the articy:draft executable
  - Check the package registry URL (our default registry is available at https://packages.informatik.uni-wuerzburg.de)
  - Check the package registry scopes (our default registry currently needs the scopes 'de.jmu' and 'unity-com')
- Open example scene
  - Select 'Dev Tools > Open Present Working Directory'
  - Copy this path, you'll need it for the next step
  - Click on "crater"
  - Open "Present Working Directory/Scenes/crater.spoke". This corresponds to "%localAppData%/Temp/viavr/project/Scenes/crater.spoke" on Windows
    - We'll automate this step in future work
- To save the current scene, select File > Save Current Scene
- To save the project, select File > Save Project (this can take a while depending on the project size)
- To build the project, select "Generate VIA Experience"
  - Select "Generate Experience"
  - Choose an output folder, e.g. on your desktop
  - The build process can take a while, depending on the project size
  - To inspect the resulting Unity project, open it in Unity. You'll find your scenes in the Assets/Scenes folder.


## Known Bugs

- After loading a scene in Spoke, the editor can no longer be closed
  - Temporary workaround: use the task manager to kill the application

## Template Server

To use features related to the template server make sure to run the server (https://gitlab2.informatik.uni-wuerzburg.de/GE/Dev/ViaVR/servers/template-server) and specify the server address in the preferences.