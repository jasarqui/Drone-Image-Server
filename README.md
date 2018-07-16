This is a web application made for the [International Rice Research Institute](http://irri.org/) for the internship project, <br><strong>Drone Image Analysis.</strong>

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## Table of Contents

- [Dependencies](#dependencies)
- [Development](#development)
- [File Structure](#file-structure)
- [Bugs and Feedback](#bugs-and-feedback)
- [About the Developers](#about-the-developers)

## Dependencies

The application requires the following installed for development:

* `NodeJS` framework
* `PostgreSQL` database
* `yarn` (optional) CLI

In the PostgreSQL database, you must create a `SUPERUSER` to access the database, and a schema called `dronedb` with the `PASSWORD` of `dronedb`.

Clone the application [server](https://github.com/jasarqui/Drone-Image-Server) and [client](https://github.com/jasarqui/Drone-Image-Client) folders. Run a terminal inside both folders and then run `npm install` or `yarn add` in each. This will set up the remaining dependencies needed by the application to run.

In the server terminal, run `npm run seed` or `yarn seed` to set up the schema.

## Development

When developing the app, open terminals that will open both the [server](https://github.com/jasarqui/Drone-Image-Server) and the [client](https://github.com/jasarqui/Drone-Image-Client) folders. Run `npm start` or `yarn start` on both terminals. Once the application loads, you can start developing.

It is also important to note that everytime you make a change to the code of the application, `create-react-app` already has a module that updates itself through `react-scripts` so you get all the new updates automatically.

## File Structure

The folders are implemented as follows (once all dependencies have been installed):

<strong>Client</strong>

```
drone-image-client/
  node_modules/
  public/
    dia-logo.png
    index.html
    manifest.json
  src/
    api/
      entities/
        ...<entity>.js
      index.js
    app/
      App.js
    assets/
      ...<asset>
      index.css
    components/
      ...<component>/
    index.js
    registerServiceWorker.js
  package.json
  README.md
  yarn.lock
  .gitignore
```

<strong>Server</strong>

```
drone-image-server/
  build/
  node_modules/
  db/
    models/
      ...<model>.js
    index.js
    seed.js
  src/
    entities/
      ...<entity>/
        controller.js
        router.js
    api.js
    index.js
  package.json
  package-lock.json
  README.md
  yarn.lock
  .gitignore
```

## Bugs and Feedback

If there are any bugs or feedback that concerns the project, go to the issues ([client](https://github.com/jasarqui/Drone-Image-Client/issues) or [server](https://github.com/jasarqui/Drone-Image-Server/issues)) tabs.


## About the Developers

This web application is made by [Jasper Arquilita](https://github.com/jasarqui), a student from University of the Philippines Los Baños. The other part of the project which is for <strong>Image Processing</strong> is made by a co-student, Loria Malingan.
