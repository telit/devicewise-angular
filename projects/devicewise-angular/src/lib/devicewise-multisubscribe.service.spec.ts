
import { TestBed, async } from '@angular/core/testing';
import { filter } from 'rxjs/operators';
import { DevicewiseAngularModule } from './devicewise-angular.module';
import { DevicewiseAuthService } from './devicewise-auth.service';
import { DevicewiseMultisubscribeService } from './devicewise-multisubscribe.service';
import { DwSubscription } from './models/dwsubscription';
import { DwType } from './models/dwconstants';


describe('DevicewiseMultisubscribeNewService', () => {
  let service: DevicewiseMultisubscribeService;
  let authService: DevicewiseAuthService;
  const endpoint = 'http://192.168.1.15:88';
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
      providers: [DevicewiseMultisubscribeService, DevicewiseAuthService]
    });
    service = TestBed.get(DevicewiseMultisubscribeService);
    authService = TestBed.get(DevicewiseAuthService);
    if (authService.getLoginStatus() === false) {
      authService.easyLogin(endpoint, username, password).subscribe((data) => { });
    }
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be able to subscribe to observable forever', (done: DoneFn) => {
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
        }
      },
      error: (err) => console.log('err', err),
      complete: () => console.log('complete')
    });

    setTimeout(() => {
      subscription.unsubscribe();
      done();
    }, 4000);

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

  it('should be able to subscribe many times', (done: DoneFn) => {
    const subs = [];

    variables.forEach((variable) => {
      subs.push(new DwSubscription(variable.device, variable.variable, variable.type, variable.count, variable.length).request.params);
    });

    const multiSubscribe$ = service.multiSubscribe(subs);
    const random = Math.floor(Math.random() * 10);
    for (let i = 0; i < random; i++) {
      const subscription = multiSubscribe$.subscribe({
        next: (data) => {
          expect(data.device.length).toBeGreaterThan(0);
          expect(data.variable.length).toBeGreaterThan(0);
          expect(data.data[0]).toBeGreaterThanOrEqual(0);
          expect(data.data[0]).toBeLessThanOrEqual(100);
        },
        error: (err) => console.log('err', err),
        complete: () => console.log('complete')
      });

      setTimeout(() => {
        subscription.unsubscribe();
      }, 1000);
    }

    setTimeout(() => {
      done();
    }, 2000);
  });

  it('should subscribe, unsubscribe, subscribe', (done: DoneFn) => {
    const subs = [];

    variables.forEach((variable) => {
      subs.push(new DwSubscription(variable.device, variable.variable, variable.type, variable.count, variable.length).request.params);
    });

    const random = Math.floor(Math.random() * 10);
    for (let i = 0; i < random; i++) {
      const random2 = Math.floor(Math.random() * 10);
      const multiSubscribe$ = service.multiSubscribe(subs);
      for (let j = 0; j < random2; j++) {
        const subscription = multiSubscribe$.subscribe({
          next: (data) => {
            expect(data.device.length).toBeGreaterThan(0);
            expect(data.variable.length).toBeGreaterThan(0);
            expect(data.data[0]).toBeGreaterThanOrEqual(0);
            expect(data.data[0]).toBeLessThanOrEqual(100);
          },
          error: (err) => console.log('err', err),
          complete: () => console.log('complete')
        });

        setTimeout(() => {
          subscription.unsubscribe();
        }, 2000);
      }
    }

    setTimeout(() => {
      done();
    }, 2000);
  });

  it('should subscribe, unsubscribe, subscribe', (done: DoneFn) => {
    const subs = [];

    variables.forEach((variable) => {
      subs.push(new DwSubscription(variable.device, variable.variable, variable.type, variable.count, variable.length).request.params);
    });

    const multiSubscribe$ = service.multiSubscribe(subs);
    const random = Math.floor(Math.random() * 10);

    variables.forEach((variable) => {
      const subscription = multiSubscribe$.pipe(
        filter((val) => val.variable === variable.variable)
      ).subscribe({
        next: (data) => {
          // console.log('var' + variable.variable, data);
          expect(data.device.length).toBeGreaterThan(0);
          expect(data.variable.length).toBeGreaterThan(0);
          expect(data.device).toEqual(variable.device);
          expect(data.variable).toEqual(variable.variable);
          expect(data.data[0]).toBeGreaterThanOrEqual(0);
          expect(data.data[0]).toBeLessThanOrEqual(100);
        },
        error: (err) => console.log('err', err),
        complete: () => console.log('complete')
      });

      setTimeout(() => {
        subscription.unsubscribe();
      }, 1000);
    });

    setTimeout(() => {
      done();
    }, 2000);
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
          done();
        }
      },
      error: (err) => console.log('err', err),
      complete: () => console.log('complete')
    });
  });

  it('should be able to unsubscribe and resubscribe', (done: DoneFn) => {
    const subs = [];

    variables.forEach((variable) => {
      subs.push(new DwSubscription(variable.device, variable.variable, variable.type, variable.count, variable.length).request.params);
    });

    let messagesReceived = 0;
    const multiSubscribe$ = service.multiSubscribe(subs);
    let subscription = multiSubscribe$.subscribe({
      next: (data) => {
        expect(data.device.length).toBeGreaterThan(0);
        expect(data.variable.length).toBeGreaterThan(0);
        expect(data.data[0]).toBeGreaterThanOrEqual(0);
        expect(data.data[0]).toBeLessThanOrEqual(100);
        ++messagesReceived;
        if (messagesReceived === variables.length) {
          subscription.unsubscribe();

          messagesReceived = 0;
          subscription = multiSubscribe$.subscribe({
            next: (data2) => {
              expect(data2.device.length).toBeGreaterThan(0);
              expect(data2.variable.length).toBeGreaterThan(0);
              expect(data2.data[0]).toBeGreaterThanOrEqual(0);
              expect(data2.data[0]).toBeLessThanOrEqual(100);
              ++messagesReceived;
              if (messagesReceived === variables.length) {
                subscription.unsubscribe();

                done();
              }
            },
            error: (err) => console.log('err', err),
            complete: () => console.log('complete')
          });

          // done();
        }
      },
      error: (err) => console.log('err', err),
      complete: () => console.log('complete')
    });
  });

});
