# VIA-VR Editor


## Prerequisites

- Make sure to clone recursively, i.e. including all submodules
- Make sure [node.js](https://nodejs.org/en/download/) >=16.10 is installed
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

- Make sure Unity 2020 LTS or newer is installed. Recommended: 2021.3.0f1
- Make sure your internet connection is working properly
- If you want to use articy:draft, make sure it's installed

## Required Ports

- 3000
- 9090

## How to Start (Currently Only Tested on Windows)

- We recommend doing the following steps in cmd.exe
- Navigate to the `code` folder and run the following commands:
  - Run `npm install`
  - Run `npm start` to start the application

## How to Start Only the Frontend

When developing a new UI window, it can be useful to just start the frontend to view the result. This will be considerably faster than also starting the backend. It also comes with faster hot-reloading. When starting just the frontend you will not be able to fetch data from the backend, so only use this when working with dummy data.

- Navigate to the `code` folder and run the following commands:
  - Run `npm install`
  - Run `npm start:frontend`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits. You will also see any lint errors in the console. Navigate to subpages using the `#/` notation (e.g. `http://localhost:3000#/hello-world`).

## How to Build Executable (Currently Windows Only)

- Navigate to the `code` folder and run the following commands:
  - Run `npm install`
  - Run `npm run package` to build an executable for your system
- Install [Yarn](https://yarnpkg.com/) on the target PC
- Copy the setup executable from the `dist` folder to the target PC
- Run the setup executable on the target PC

## How to Run Unit Tests

Currently, only the backend has unit tests. `electron-is-dev` is incompatible with unit tests.

- Navigate to the `code` folder and run the following commands:
  - Run `npm install`
  - Run `npm test`

## How to Use the Application

- Start the application
  - Do not close any terminal windows that appear
- Select 'Open Project'
  - Open the example project we provide at "RepoRoot/code/res/ExampleProject.via"
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