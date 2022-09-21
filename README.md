# TodoApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.12.
This project is a simple application that handles two way binding and interactable todo lists. Add and Delete functionality with user friendly notifications that let you know when things finish successfully or fail.

## Development server

Run `ng serve` or `ng s` for short hand for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io). Test specs have been generated, however they are not setup.

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Libraries used

Material UI library has been added to the project for quick UI and layout development.

## Data structure and choices

Sticking with the RxJs library that comes packaged with Angular, this is how we subscribe and listen to data streams and observable data.
I have structured the project with a data layer service that acts like an API layer service. If the application was hooked up with a backend and an API service, then we could simply plug it into the data layer service.

The code structure takes the form of interacting with RESTful data. We use behavior subjects, observables, subscription handlers and event emitters. The layout structure was intended to be modularised. To take things further, we could create module files for the components and export them separately for lazy loaded modules.
