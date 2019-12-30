import { DevicewiseAngularModule } from './devicewise-angular.module';
import { DevicewiseAngularService } from './devicewise-angular.service';
import { DwType } from './models/dwconstants';
import { TestBed, async } from '@angular/core/testing';

import { DevicewiseMultisubscribeNewService } from './devicewise-multisubscribe-new.service';
import { DwSubscription } from './models/dwsubscription';
import { Subscription } from 'rxjs';

fdescribe('DevicewiseMultisubscribeNewService', () => {
  let service: DevicewiseMultisubscribeNewService;
  let authService: DevicewiseAngularService;
  const endpoint = 'http://192.168.1.19:88';
  const username = 'admin';
  const password = 'admin';
  const variables: any[] = [
    { device: 'OEE', variable: 'Availability', type: DwType.FLOAT4, count: 1, length: -1, testData: [[0], [1], [2], [3], [4]] },
    { device: 'OEE', variable: 'Quality', type: DwType.FLOAT4, count: 1, length: -1, testData: [[0], [1], [2], [3], [4]] },
    { device: 'OEE', variable: 'Performance', type: DwType.FLOAT4, count: 1, length: -1, testData: [[0], [1], [2], [3], [4]] },
    { device: 'OEE', variable: 'OEE', type: DwType.FLOAT4, count: 1, length: -1, testData: [[0], [1], [2], [3], [4]] }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DevicewiseAngularModule],
      providers: [DevicewiseMultisubscribeNewService, DevicewiseAngularService]
    });
    service = TestBed.get(DevicewiseMultisubscribeNewService);
    authService = TestBed.get(DevicewiseAngularService);
    if (authService.getLoginStatus() === false) {
      authService.easyLogin(endpoint, username, password).subscribe((data) => { });
    }
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be able to subscribe to observable once', (done: DoneFn) => {
    const subs = [];

    variables.forEach((variable) => {
      subs.push(new DwSubscription(variable.device, variable.variable, variable.type, variable.count, variable.length).request.params);
    });

    let messagesReceived = 0;
    const multiSubscribe$ = service.multiSubscribe(subs);
    const subscription = multiSubscribe$.subscribe({
      next: (data) => {
        expect(data.device.length).toBeGreaterThan(0);
        expect(data.variable.length).toBeGreaterThan(0);
        expect(data.data[0]).toBeGreaterThanOrEqual(0);
        expect(data.data[0]).toBeLessThanOrEqual(100);
        ++messagesReceived;
        if (messagesReceived === variables.length) {
          subscription.unsubscribe();
          done();
        }
      },
      error: (err) => console.log('err', err),
      complete: () => console.log('complete')
    });
  });

  it('should be able to subscribe to observable twice', (done: DoneFn) => {
    const subs = [];

    variables.forEach((variable) => {
      subs.push(new DwSubscription(variable.device, variable.variable, variable.type, variable.count, variable.length).request.params);
    });

    let messagesReceived1 = 0;
    let subscriptionsDone = 0;
    const multiSubscribe$ = service.multiSubscribe(subs);
    const subscription1 = multiSubscribe$.subscribe({
      next: (data) => {
        expect(data.device.length).toBeGreaterThan(0);
        expect(data.variable.length).toBeGreaterThan(0);
        expect(data.data[0]).toBeGreaterThanOrEqual(0);
        expect(data.data[0]).toBeLessThanOrEqual(100);
        ++messagesReceived1;
        if (messagesReceived1 === variables.length) {
          subscription1.unsubscribe();
          ++subscriptionsDone;
          if (subscriptionsDone === 2) {
            done();
          }
        }
      },
      error: (err) => console.log('err', err),
      complete: () => console.log('complete')
    });

    let messagesReceived2 = 0;
    const subscription2 = multiSubscribe$.subscribe({
      next: (data) => {
        expect(data.device.length).toBeGreaterThan(0);
        expect(data.variable.length).toBeGreaterThan(0);
        expect(data.data[0]).toBeGreaterThanOrEqual(0);
        expect(data.data[0]).toBeLessThanOrEqual(100);
        ++messagesReceived2;
        if (messagesReceived2 === variables.length) {
          subscription2.unsubscribe();
          ++subscriptionsDone;
          if (subscriptionsDone === 2) {
            done();
          }
        }
      },
      error: (err) => console.log('err2', err),
      complete: () => console.log('complete2')
    });
  });

  it('should be able to unsubscribe', (done: DoneFn) => {
    const subs = [];

    variables.forEach((variable) => {
      subs.push(new DwSubscription(variable.device, variable.variable, variable.type, variable.count, variable.length).request.params);
    });

    let messagesReceived = 0;
    const multiSubscribe$ = service.multiSubscribe(subs);
    const subscription = multiSubscribe$.subscribe({
      next: (data) => {
        expect(data.device.length).toBeGreaterThan(0);
        expect(data.variable.length).toBeGreaterThan(0);
        expect(data.data[0]).toBeGreaterThanOrEqual(0);
        expect(data.data[0]).toBeLessThanOrEqual(100);
        ++messagesReceived;
        if (messagesReceived === variables.length) {
          subscription.unsubscribe();
          console.log(subscription);
          done();
        }
      },
      error: (err) => console.log('err', err),
      complete: () => console.log('complete')
    });
  });

  it('should be able to unsubscribe', (done: DoneFn) => {
    const subs = [];

    variables.forEach((variable) => {
      subs.push(new DwSubscription(variable.device, variable.variable, variable.type, variable.count, variable.length).request.params);
    });

    let messagesReceived = 0;
    const multiSubscribe$ = service.multiSubscribe(subs);
    const subscription = multiSubscribe$.subscribe({
      next: (data) => {
        expect(data.device.length).toBeGreaterThan(0);
        expect(data.variable.length).toBeGreaterThan(0);
        expect(data.data[0]).toBeGreaterThanOrEqual(0);
        expect(data.data[0]).toBeLessThanOrEqual(100);
        ++messagesReceived;
        if (messagesReceived === variables.length) {
          subscription.unsubscribe();
          console.log(subscription);
          done();
        }
      },
      error: (err) => console.log('err', err),
      complete: () => console.log('complete')
    });
  });

});
