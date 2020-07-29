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

## Pagination

Library ued: https://www.npmjs.com/package/ngx-pagination

## TODOS:

- Delete unused certificate images inside Azure assets directory
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

## Swiper JS

Install Swiper packages added into package.json. 

Check `angular.json` file to know how to import the styles.

Dont forget to add the SwiperModule `ngx-swiper-wrapper` into the application module.

Visit `ngx-swiper-wrapper` documentation

