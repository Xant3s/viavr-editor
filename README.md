# VIA-VR Editor
         
## About

The VIA-VR project presents an innovative authoring platform designed to revolutionize Virtual Reality (VR) applications in the medical domain. At its core, this platform aims to empower medical professionals to create, modify, and implement VR experiences tailored for educational and therapeutic purposes. By significantly lowering the barriers to entry in terms of development effort and technical expertise required, VIA-VR stands at the forefront of making VR technology more accessible and applicable in healthcare settings.

VIA-VR is developed by a consortium consisting of:
- Games Engineering Group, Julius-Maximilians-Universität Würzburg
- Human-Computer-Interaction Group, Julius-Maximilians-Universität Würzburg
- Graphics & Geometry Group, Technische Universität Dortmund
- Health-Technology-Ethics Group, Evangelische Hochschule Ludwigsburg
- Articy Software GmbH & Co. KG, Germany

The VIA-VR project is funded by the German Federal Ministry of Education and Research (BMBF) as part of the research initiative for Human-Technology Interaction ”Digital Platforms: Interactive Assistance Systems for Humans“ (project number 16SV8444).

This repository contains the editor part of the VIA-VR project, made by the Games Engineering Group at the Julius-Maximilians-Universität Würzburg.

[Project website](https://www.hci.uni-wuerzburg.de/projects/via-vr/)


## Prerequisites

Before using the VIA-VR software, an IT administrator must install the following required software to ensure its proper functionality.

- Make sure Python [(version 3.8 or 3.9)](https://www.python.org/ftp/python/3.8.0/python-3.8.0-amd64.exe) is installed. The recommender system requires Python.
- Make sure [node.js](https://nodejs.org/en/download/) >= 22 is installed

  - To check that Node.js was installed correctly, type the following commands in your terminal client:

    ```bash
    node -v
    npm -v
    ```
  - Node 22.x will include Corepack, which includes [Yarn](https://yarnpkg.com/). To enable Corepack, run as administrator:

    ```bash
    corepack enable
    ```

  - To check that Yarn was installed correctly, type the following command in your terminal client:

    ```bash
    yarn -v
    ```

- Make sure Unity 2021.3.31f1 is installed
  - Make sure to install the [Android Build Support module](https://docs.unity3d.com/Manual/android-sdksetup.html), API level 29 or above
  - To verify that Unity was installed successfully, check if the folder `C:\Program Files\Unity\Hub\Editor\2021.3.31f1\Editor\Data\PlaybackEngines\AndroidPlayer\SDK\build-tools` exists and is not empty. If this folder doesn't exist, reinstall Unity with Android Build Support 
  - Make sure the IL2CPP scripting backend is installed
- Make sure your internet connection is working properly
- Download either the portable or installer version from the release page of this repository


## How to Use the Application

- Start the application
  - Do not close any terminal windows that appear
- Select 'Open Project'
  - Open the example project we provide at "[software install directory]/res/DefaultProject.via"
  - You may see a loading screen for a few seconds while Spoke is still starting
- Check your preferences
  - Go to File > Preferences
  - Check the path to the Unity executable
  - Check the package registry URL (our default registry is available at https://packages.informatik.uni-wuerzburg.de)
  - Check the package registry scopes (our default registry currently needs the scopes 'de.jmu' and 'unity-com')
- To save the project, select File > Save Project (this can take a while depending on the project size)
- To build the project, navigate to the finish tab, check all settings, then select "Generate VIA Experience"
  - Select "Generate Experience"
  - Choose an output folder, e.g. on your desktop
  - The build process can take a while, depending on the project size
  - For developers: To inspect the resulting Unity project, open it in Unity. You'll find your scenes in the Assets/Scenes folder.

See [user manual](UserManual.pdf) for further details.

## Project Status

This repository contains the codebase and resources for a completed research project. The project has reached its intended goals and objectives, and no further active development or maintenance is planned.



## Contact

Prof. Dr. Sebastian von Mammen  
Games Engineering Group  
Chair of Human-Computer Interaction  
Julius-Maximilians-Universität Würzburg
sebastian.von.mammen@uni-wuerzburg.de


# For Developers

See [Developer_Documentation.pdf](Developer_Documentation.pdf)


## Prerequisites for Development

- Make sure to clone recursively, i.e. including all submodules. Do not just download the zip file
- See prerequisites above

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

## Contributing

As there is no active maintainer for this project, contributions are not being actively reviewed or merged. However, if you wish to extend or build upon this work, you are welcome to fork the repository and continue development on your own.


## Contributers

Project Lead: Prof. Dr. Sebastian von Mammen

Lead Developer: Samuel Truman

Developers:  
- Samuel Truman
- Johannes Büttner  
- Sooraj K Babu


Further Contributors (in alphabetical order):

- Anne Vetter
- Carl Beker
- David Egelhofer
- Fabian Maier
- Florian Schmidt
- Jonas Schindler
- Lea Kohl
- Lennard Rüffert
- Roman Bornschier
- Sarah Hofmann
- Sebastian Dietz
- Sven Gerlach
- Tobias Brandner
- Wenzel Hünting