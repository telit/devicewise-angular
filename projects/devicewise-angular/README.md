[![npm version](https://badgen.net/npm/v/devicewise-angular?icon=npm)](https://badgen.net/npm/v/devicewise-angular?icon=npm)
[![npm downloads](https://badgen.net/npm/dy/devicewise-angular?icon=npm)](https://badgen.net/npm/v/devicewise-angular?icon=npm)
[![Build Status](https://travis-ci.com/astone2014/devicewise-angular.svg?branch=master)](https://travis-ci.com/astone2014/devicewise-angular)
[![Known Vulnerabilities](https://snyk.io/test/github/astone2014/devicewise-angular/badge.svg?targetFile=projects/devicewise-angular/package.json)](https://snyk.io/test/github/astone2014/devicewise-angular?targetFile=projects/devicewise-angular/package.json)

# DeviceWISE Angular API Service

Angular services for communicating with deviceWISE.

# Installation

```cli
npm install devicewise-angular --save
```

Import the devicewise angular module in your `app.module.ts`:

```ts
...
import { DevicewiseAngularModule } from 'devicewise-angular';

@NgModule({
  imports: [
    ...
    DevicewiseAngularModule.forRoot()
```

Then, import and inject the devicewise angular service into a component:

```ts
...
import { DevicewiseAuthService, DevicewiseApiService } from 'devicewise-angular';
import { switchMap } from 'rxjs/operators';

@Component({
  ...
})
export class AppComponent implements OnInit {
  constructor(
    private dwAuthentication: DevicewiseAuthService,
    private dwApi: DevicewiseApiService
  ) {}
 
  ngOnInit(): void {
    this.dwAuthentication.easyLogin('http://localhost:8080', 'admin', 'admin').pipe(
      switchMap((e) => this.dwApi.deviceList())
    ).subscribe((e) => console.log(e));
  }
  ...
```
The `easyLogin` method will automatically save the sessionId from the login request as a cookie. If a cookie already exists it will be checked for validity before emitting sucessful login.

# MultiSubscribe
Using HTTP fetch is a much more efficient way to communicate with devicewise. Consider using the multisubscribe store service to subscribe to a variable rather than poll a variable on an interval.


```ts
...
import { DevicewiseAuthService } from 'devicewise-angular';

@Component({
  ...
})
export class AppComponent implements OnInit {
  constructor(
    private dwAuthentication: DevicewiseAuthService,
    private dwMultiSubscribeService: DevicewiseMultisubscribeStoreService
  ) { }

  variables: DwVariable[] = [{ device: 'System Monitor', variable: 'CPU.CPU Usage', type: DwType.UINT1, count: 1, length: -1 }];

  ngOnInit(): void {
    this.dwAuthentication.easyLogin('http://localhost:8080', 'admin', 'admin').pipe(
      switchMap((e) => this.dwMultiSubscribeService.addRequestVariables(this.variables))
    ).subscribe((e) => console.log('value changed:', e));
  }
  ...
```

Make sure you unsubscribe from the multisubscribe store obervable!

It's also common to save the observable.
```ts
this.multisub$ = this.dwMultiSubscribeService.subscriptionAsObservable();
```
To get a specific variable out of the observable create a pipe containing filter.
```ts
this.multisub$.pipe(
  filter((e) => e.device.name == 'System Monitor' && e.variable.name = 'CPU.CPU Usage')
).subscribe((e) => console.log(e))
```
Another possibility. Create an async pipe in your html template
```html
<div *ngIf="multisub$ | async as variable">
  <p>Value: {{variable.data[0]}}</p>
</div>
```

This multisubscribe store makes it easy to add, remove, and edit variables from a single stream from devicewise.

# Cross Origin Resource Sharing (CORS)
Cross-Origin Resource Sharing (CORS) is a mechanism that uses additional HTTP headers to tell browsers to give a web application running at one origin, access to selected resources from a different origin.

Run these steps to enable CORS on deviceWISE.

* Navigate to your deviceWISE install directory
* Open the file "deviceWISE\Runtime\dwcore\dwcore.properties"
* Add the line "#http.allow_origin=http://localhost:4200" anywhere in the file (where http://localhost:4200 is the origin to allow access)
* Save the file
* Restart deviceWISE

# Polyfills
At the bottom of `polyfills.ts` under `APPLICATION IMPORTS` add the following and run the command in the comment.
```ts
/**
 * Fetch Readablestream Polyfills
 * https://github.com/jonnyreeves/fetch-readablestream
 * Run `npm install --save web-streams-polyfill text-encoding babel-polyfill abortcontroller-polyfill`.
 * This is used for subscriptions in IE11.
 */
import 'web-streams-polyfill';
import 'text-encoding';
import 'babel-polyfill';
import 'abortcontroller-polyfill';
```
# What to do now?

* Run `ng test devicewise-angular` to run the tests devicewise angular.
* Have a look at and play around with the `app` to get to know the devicewise service with `ng serve --open`
* Set up other users in deviceWISE (default credentials are admin/admin)

# Running the Demo

Clone the repository.

```cli
git clone https://github.com/telit/devicewise-angular.git
```

Navigate to the folder.

```cli
cd devicewise-angular
```

Install packages.

```cli
npm i
```

Run Demo.

```cli
ng serve --open
```

# FAQ

## General tips

Checking out the following resources usually solves most of the problems people seem to have with this devicewise service:

* [📚 DeviceWISE Docs](http://help.devicewise.com/display/M2MOpen/JavaScript+API+Library)
* [DeviceWISE Javascript Library](https://docs.devicewise.com/Content/Products/GatewayDevelopersGuide/JavaScript-API-Library.htm?Highlight=javascript)
* [DeviceWISE Postman Collection](https://documenter.getpostman.com/view/4197967/RzZDgvoy)

The following general steps are usually very helpful when debugging problems with this service:

* check out if there are any [open](https://github.com/telit/devicewise-angular/issues) or [closed](https://github.com/telit/devicewise-angular/issues?q=is%3Aissue+is%3Aclosed) issues that answer your question
* ensure you have a valid sessionID cookie.
* [explain to your local rubber duck why your code should work and why it (probably) does not](https://en.wikipedia.org/wiki/Rubber_duck_debugging)

# Opening issues

Please make sure to check out our FAQ before you open a new issue. Also, try to give us as much information as you can when you open an issue. Maybe you can even supply a test environment or test cases, if necessary?

# Contributing

We are happy to accept pull requests or test cases for things that do not work. Feel free to submit one of those.

However, we will only accept pull requests that pass all tests and include some new ones (as long as it makes sense to add them, of course).

* [Open a new pull request](https://github.com/telit/devicewise-angular/compare)

# Author

This library is provided to you free by [Telit IoT Platforms](https://telit.com/).

# License

[MIT](https://github.com/telit/devicewise-angular/blob/master/LICENSE)
