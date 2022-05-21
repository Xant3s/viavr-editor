# VIA-VR Editor


## Prerequisites

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

- Make sure Unity 2020 LTS or newer is installed

## How to Start (Currently Only Tested on Windows)

- Navigate to the `code` folder and run the following commands:
  - Run `npm install`
  - Run `npm start` to start the application

## How to Start Only the Frontend

When developing new UI it can be useful to just start the frontend to view the result. This will be considerably faster than also starting the backend. It also comes with faster hot-reloading. When starting just the frontend you will not be able to fetch data from the backend, so only use this when working with dummy data.

- Navigate to the `code` folder and run the following commands:
  - Run `npm install`
  - Run `npm start:frontend`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits. You will also see any lint errors in the console. Navigate to subpages using the `#/` notation (e.g. `http://localhost:3000#/hello-world`).

## How to Build Executable (Currently Windows Only)

- Navigate to the `code` folder and run the following commands:
  - Run `npm install`
  - Run `npm run package` to build executable for your system
- Install [Yarn](https://yarnpkg.com/) on the target PC
- Copy the setup executable from the `dist` folder to the target PC
- Run the setup executable on the target PC

## How to Run Unit Tests

- Navigate to the `code` folder and run the following commands:
  - Run `npm install`
  - Run `npm test`
