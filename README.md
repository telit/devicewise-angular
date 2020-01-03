
[![Build Status](https://travis-ci.com/astone2014/devicewise-angular.svg?branch=master)](https://travis-ci.com/astone2014/devicewise-angular)
[![Known Vulnerabilities](https://snyk.io/test/github/astone2014/devicewise-angular/badge.svg?targetFile=projects/devicewise-angular/package.json)](https://snyk.io/test/github/astone2014/devicewise-angular?targetFile=projects/devicewise-angular/package.json)

# DeviceWISE Angular API Service

Angular services for communicating with deviceWISE.

# Installation

```bash
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
import { DevicewiseAngularService } from 'devicewise-angular';

@Component({
  ...
})
export class AppComponent implements OnInit {
  constructor(private devicewise: DevicewiseAngularService) {}

  ngOnInit() {
    this.dwAuthentication.easyLogin('http://localhost:88', 'admin', 'admin').pipe(
      switchMap((loginResponse) => this.dwApi.deviceList())
    ).subscribe((deviceListResponse) => console.log(deviceListResponse));
  }
  ...
```
The `easyLogin` method will automatically save the sessionId from the login request as a cookie. If a cookie already exists it will be checked for validity before emitting sucessful login.

# MultiSubscribe
Using HTTP fetch is a much more efficient way to communicate with devicewise. Consider using multisubscribe to subscribe to variable data rather than read a variable on an interval.


```ts
...
import { DevicewiseAngularService } from 'devicewise-angular';

@Component({
  ...
})
export class AppComponent implements OnInit {
  constructor(private devicewise: DevicewiseAngularService) {}

  ngOnInit() {
    const variables: Variable[] = [{ device: 'Machine1', variable: 'OEE', type: DwType.FLOAT4, count: 1, length: -1 }];

    this.dwMultiSubscribeService.addRequestVariables(variables);    
    this.dwAuthentication.easyLogin('http://localhost:88', 'admin', 'admin').pipe(
      switchMap((loginResponse) => this.dwMultiSubscribeService.subscriptionAsObservable())
    ).subscribe((deviceListResponse) => console.log(deviceListResponse));
  }
  ...
```

Make sure you unsubscribe from the multisubscribe store obervable!

This multisubscribe store makes it easy to add, remove, and edit variables from a single stream from devicewise.

# What to do now?

* Run `ng test devicewise-angular` to run the tests devicewise angular.
* Have a look at and play around with the `app` to get to know the devicewise service with `ng serve --open`
* Set up other users in deviceWISE (default credentials are admin/admin)

# Running the Demo

Clone the repository.

```bash
git clone https://github.com/astone2014/devicewise-angular.git
```

Navigate to the folder.

```bash
cd devicewise-angular
```

Install packages.

```bash
npm i
```

Run Demo.

```bash
ng serve --open
```

# FAQ

## General tips

Checking out the following resources usually solves most of the problems people seem to have with this devicewise service:

* [DeviceWISE HELP](https://docs-engr.devicewise.com/)
* [DeviceWISE Javascript Library](http://help.devicewise.com/display/M2MOpen/JavaScript+API+Library)
* [DeviceWISE Postman Collection](https://web.postman.co/collections/4197967-d416fb5a-b10d-47fb-9bd4-b740c4842503?workspace=0a806903-4bd9-4c42-8f6a-a4cecdf162d1)

The following general steps are usually very helpful when debugging problems with this service:

* check out if there are any [open](https://github.com/astone2014/devicewise-angular/issues) or [closed](https://github.com/astone2014/devicewise-angular/issues?q=is%3Aissue+is%3Aclosed) issues that answer your question
* ensure you have a valid sessionID cookie.
* [explain to your local rubber duck why your code should work and why it (probably) does not](https://en.wikipedia.org/wiki/Rubber_duck_debugging)

# Opening issues

Please make sure to check out our FAQ before you open a new issue. Also, try to give us as much information as you can when you open an issue. Maybe you can even supply a test environment or test cases, if necessary?

# Contributing

We are happy to accept pull requests or test cases for things that do not work. Feel free to submit one of those.

However, we will only accept pull requests that pass all tests and include some new ones (as long as it makes sense to add them, of course).

* [Open a new pull request](https://github.com/astone2014/devicewise-angular/compare)

# Author

This library is provided to you free by [Telit IoT Platforms](https://telit.com/).

# License

[MIT](https://github.com/astone2014/devicewise-angular/master/LICENSE)
