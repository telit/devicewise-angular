# DeviceWISE Angular API Service

An Angular (2+) service for communicating with deviceWISE.

# Installation

```bash
npm install devicewise-angular --save

# or

yarn add devicewise-angular
```

Add the devicewise angular module to your `app.module.ts`:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DevicewiseAngularModule } from 'devicewise-angular';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    DevicewiseAngularModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

Then, import and inject the devicewise angular service into a component:

```typescript
import { Component, OnInit } from '@angular/core';
import { DevicewiseAngularService } from 'devicewise-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private devicewise: DevicewiseAngularService) {}
  title = 'dwtest';

  ngOnInit() {
    this.devicewise.login(location.origin, 'admin', 'admin').subscribe(loginResponse => {
      console.log(loginResponse);
      this.devicewise.deviceList().subscribe((deviceListResponse) => {
        console.log(deviceListResponse);
      });
    });
  }
}
```

That's it!

# What to do now?

* Run `npm run test` to run the tests for the devicewise service (located in the `demo-app` folder)
* Have a look at and play around with the `demo-app` to get to know the devicewise service with `ng serve --open`
* Set up other users in deviceWISE (default credentials are admin/admin)

# FAQ

## General tips

Checking out the following resources usually solves most of the problems people seem to have with this devicewise service:

* [DeviceWISE HELP @MDN](https://docs-engr.devicewise.com/)

The following general steps are usually very helpful when debugging problems with this service:

* check out if there are any [open](https://github.com/issues) or [closed](https://github.com/issues?q=is%3Aissue+is%3Aclosed) issues that answer your question
* ensure you have a valid sessionID cookie.
* [explain to your local rubber duck why your code should work and why it (probably) does not](https://en.wikipedia.org/wiki/Rubber_duck_debugging)

# Opening issues

Please make sure to check out our FAQ before you open a new issue. Also, try to give us as much information as you can when you open an issue. Maybe you can even supply a test environment or test cases, if necessary?

# Contributing

We are happy to accept pull requests or test cases for things that do not work. Feel free to submit one of those.

However, we will only accept pull requests that pass all tests and include some new ones (as long as it makes sense to add them, of course).

* [Open a new pull request](https://github.com/compare)

# Author

This service is provided to you free by [Telit IoT Platforms](https://telit.com/).

# License

[MIT](https://github.com/master/LICENSE)
