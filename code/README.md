# VIA-VR Editor


## Prerequisites

- Make sure [node.js](https://nodejs.org/en/download/) >=16.10 is installed
    - To check that Node.js was installed correctly, type the following commands in your terminal client:
    ```
    node -v
    npm -v
    ```
  - Node >=16.10 will include Corepack, which includes [Yarn](https://yarnpkg.com/). To enable Corepack, run as administrator: 
  ```
  corepack enable
  ```
  - To check that Yarn was installed correctly, type the following command in your terminal client:
  ```
  yarn -v
  ```


## How to Start

- Navigate to the `code` folder and run the following commands:
  - Run `npm install`
  - Run `npm start` to start the application

## How to Build Executable (Currently Windows Only)

- Navigate to the `code` folder and run the following commands:
  - Run `npm install`
  - Run `npm run make:win` to build executable for your system
- Install [Yarn](https://yarnpkg.com/) on the target PC
- Copy the `out/{Appname}` folder to the target PC
