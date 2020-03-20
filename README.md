# AuroraWebsite

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.21.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Postman collection

https://www.getpostman.com/collections/86501829d7d45ac17cb3

## Cart

To see how cart functionality works see Bernardo's OneNote notes

## TODOS:

- Add course Categories to store for more efficiency usign NgRx Entity
- Pagination on all views
- Implement auth guards on the following routes:
  * my courses
  * checkout
- Implement propper redirections when the user logs out
- Delete unused certificate images inside assets directory
- Components that require authentication (Ej. AllMycoursesComponent) should not redirect to any route when they receive no user inside the user subscription. The login with token failure effect should take care of the redirection the a not authenticated route.
- Test refreshing every route in the following cases:
  * logged in
  * not logged in
  * logged in and invalid token
- Test loggin out on every route
- Test accesing every route in the following cases:
  * logged in
  * not logged in
  * logged in and invalid token
- Implement safe navigation. Here is an example: 
  ```html
  <h2>{{contact?.name}}</h2>
  <dl>
    <dt>Phone</dt>
    <dd>{{contact?.phone}}</dd>
    <dt>Website</dt>
    <dd>{{contact?.website}}</dd>
  </dl>
  ```
  - Route guards should not grant access if they found a user token. founding a user token is not enough. Guards should validate the found token to see if it is valid and then decide to grant access. That is now possible because observables of true or false can be returned in the canActivate function.
