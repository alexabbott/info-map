# Beyond Map

Beyond Map allows users to discover and create location-based posts. This app is build with [https://angular.io/] (Angular 4) and [https://github.com/angular/angularfire2] (AngularFire2), and was initially generated with [https://github.com/angular/angular-cli] (Angular CLI).

## Installation

Ensure you have Node and NPM installed using the instructions at:

[https://nodejs.org/download/](https://nodejs.org/download/)

Install the project dependancies using:

```
    npm install
```

## Firebase setup

Create a [Firebase account](https://firebase.google.com/), create a new project, and copy the config code for your project.  

Within the project folder, run:

```
cd src
mkdir environments
cd environments
touch environments.ts
touch environments.prod.ts
```

Open 'environments.ts' and add your Firebase config as follows:

```javascript
export const environment = {
  production: false,
  firebase: {
    apiKey: "xxxx",
    authDomain: "xxxxx",
    databaseURL: "xxxxx",
    projectId: "xxxxx",
    storageBucket: "xxxx",
    messagingSenderId: "xxxx"
  }
};
```

Open 'environments.prod.ts' and add your Firebase config as follows:

```javascript
export const environment = {
  production: true,
  firebase: {
    apiKey: "xxxx",
    authDomain: "xxxxx",
    databaseURL: "xxxxx",
    projectId: "xxxxx",
    storageBucket: "xxxx",
    messagingSenderId: "xxxx"
  }
};
```

Install the necessary Firebase files using:

```
    firebase init
```

## Usage
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`.

## Build
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Deploy
Update firebase.json to use 'dist' as the public hosting directory then run:

    firebase deploy

## Directory structure

    src/                       --> Frontend sources files
    e2e/                       --> End to end tests using Protractor

## Contact

For more information please contact alexabbott