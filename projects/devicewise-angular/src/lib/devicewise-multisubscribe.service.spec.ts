import { DwSubscription } from './models/dwsubscription';
import { DevicewiseApiService } from './devicewise-api.service';
import { DwType } from './models/dwconstants';
import { DevicewiseAngularService } from './devicewise-angular.service';
import { TestBed, async } from '@angular/core/testing';

import { DevicewiseMultisubscribeService } from './devicewise-multisubscribe.service';
import { DevicewiseAngularModule } from './devicewise-angular.module';
import { Subscription } from 'rxjs';

describe('DevicewiseMultisubscribeService', () => {
  let service: DevicewiseMultisubscribeService;
  let authService: DevicewiseAngularService;
  let apiService: DevicewiseApiService;
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
      providers: [DevicewiseMultisubscribeService, DevicewiseAngularService, DevicewiseApiService]
    });
    service = TestBed.get(DevicewiseMultisubscribeService);
    authService = TestBed.get(DevicewiseAngularService);
    apiService = TestBed.get(DevicewiseApiService);

    if (authService.getLoginStatus() === false) {
      authService.easyLogin(endpoint, username, password).subscribe((data) => { });
    }
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be able to subscribe and receive data', (done: DoneFn) => {
    apiService.deviceStart(variables[0].device).subscribe(((deviceStartResponse) => {

      const subscriptions: Subscription[] = [];
      const dwSubscriptions: DwSubscription[] = [];
      const randomNumbers = [];
      let receiveCount = 0;

      variables.forEach((variable, index) => {
        const randomNumber = Math.floor(Math.random() * 100);
        randomNumbers[index] = randomNumber;
        dwSubscriptions.push(new DwSubscription(variable.device, variable.variable, variable.type, variable.count, variable.length));
      });

      service.initMultiSubscribe(dwSubscriptions);

      dwSubscriptions.forEach((dwSubscription, index) => {
        const subscription = dwSubscription.subscription.subscribe((data) => {
          ++receiveCount;
          if (receiveCount <= 4) {
            return;
          }
          expect(data.params.data.length).toEqual(1);
          expect(data.params.data).toEqual([randomNumbers[index]]);
          if (dwSubscriptions.length * 2 === receiveCount) {
            done();
            subscriptions.forEach((s) => s.unsubscribe());
          }
        });
        subscriptions.push(subscription);
      });

      setTimeout(() => {
        variables.forEach((variable, index) => {
          apiService.write(
            variable.device, variable.variable, variable.type, variable.count, variable.length, randomNumbers[index]
          ).subscribe(((readResponse) => {
            expect(readResponse).toEqual(jasmine.objectContaining({
              success: true
            }));
          }));
        });
      }, 250);

    }));
  });

  it('should get inital read on subscribe', (done: DoneFn) => {
    apiService.deviceStart(variables[0].device).subscribe(((deviceStartResponse) => {

      const subscriptions: Subscription[] = [];
      const dwSubscriptions: DwSubscription[] = [];
      const randomNumbers = [];
      let receiveCount = 0;

      variables.forEach((variable, index) => {
        dwSubscriptions.push(new DwSubscription(variable.device, variable.variable, variable.type, variable.count, variable.length));
      });

      service.initMultiSubscribe(dwSubscriptions);

      dwSubscriptions.forEach((dwSubscription, index) => {
        const subscription = dwSubscription.subscription.subscribe((data) => {
          ++receiveCount;
          expect(data.params.data.length).toEqual(1);
          if (dwSubscriptions.length === receiveCount) {
            done();
            subscriptions.forEach((s) => s.unsubscribe());
          }
        });
        subscriptions.push(subscription);
      });

    }));
  });

  it('should get inital read on subscribe', (done: DoneFn) => {
    apiService.deviceStart(variables[0].device).subscribe(((deviceStartResponse) => {

      const _subscriptions: Subscription[] = [];
      const subscriptions: DwSubscription[] = [];
      let receiveCount = 0;

      variables.forEach((variable, index) => {
        subscriptions.push(new DwSubscription(variable.device, variable.variable, variable.type, variable.count, variable.length));
      });

      service.initMultiSubscribe(subscriptions);

      subscriptions.forEach((subscription, index) => {
        const _subscription = subscription.subscription.subscribe((data) => {
          ++receiveCount;
          expect(data.params.data.length).toEqual(1);
          if (subscriptions.length === receiveCount) {
            done();
            _subscriptions.forEach((s) => s.unsubscribe());
          }
        });
        _subscriptions.push(_subscription);
      });

    }));
  });

  it('should get same subscription for 2 duplicate variables', (done: DoneFn) => {
    apiService.deviceStart(variables[0].device).subscribe(((deviceStartResponse) => {

      const subscriptions: Subscription[] = [];
      const dwSubscriptions: DwSubscription[] = [];
      let receiveCount = 0;

      for (let i = 0; i < 2; i++) {
        dwSubscriptions.push(
          new DwSubscription(variables[0].device, variables[0].variable, variables[0].type, variables[0].count, variables[0].length)
        );
      }

      service.initMultiSubscribe(dwSubscriptions);

      dwSubscriptions.forEach((dwSubscription, index) => {
        const subscription = dwSubscription.subscription.subscribe((data) => {
          console.log('got data', data, receiveCount);
          ++receiveCount;
          expect(data.params.data.length).toEqual(1);
          if (dwSubscriptions.length === receiveCount) {
            done();
            subscriptions.forEach((s) => s.unsubscribe());
          }
        });
        subscriptions.push(subscription);
      });

    }));
  });

  it('should get same subscription for 10 duplicate variables', (done: DoneFn) => {
    apiService.deviceStart(variables[0].device).subscribe(((deviceStartResponse) => {

      const subscriptions: Subscription[] = [];
      const dwSubscriptions: DwSubscription[] = [];
      let receiveCount = 0;

      for (let i = 0; i < 10; i++) {
        dwSubscriptions.push(
          new DwSubscription(variables[0].device, variables[0].variable, variables[0].type, variables[0].count, variables[0].length)
        );
      }

      service.initMultiSubscribe(dwSubscriptions);

      dwSubscriptions.forEach((dwSubscription, index) => {
        const subscription = dwSubscription.subscription.subscribe((data) => {
          console.log('got data', data, receiveCount);
          ++receiveCount;
          expect(data.params.data.length).toEqual(1);
          if (dwSubscriptions.length === receiveCount) {
            done();
            subscriptions.forEach((s) => s.unsubscribe());
          }
        });
        subscriptions.push(subscription);
      });

    }));
  });

  it('should get same subscription for 2 variables w/ 5 duplicates each', (done: DoneFn) => {
    apiService.deviceStart(variables[0].device).subscribe(((deviceStartResponse) => {

      const subscriptions: Subscription[] = [];
      const dwSubscriptions: DwSubscription[] = [];
      let receiveCount = 0;

      for (let i = 0; i < 5; i++) {
        dwSubscriptions.push(
          new DwSubscription(variables[0].device, variables[0].variable, variables[0].type, variables[0].count, variables[0].length)
        );
      }

      for (let i = 0; i < 5; i++) {
        dwSubscriptions.push(
          new DwSubscription(variables[1].device, variables[1].variable, variables[1].type, variables[1].count, variables[1].length)
        );
      }

      service.initMultiSubscribe(dwSubscriptions);

      dwSubscriptions.forEach((dwSubscription, index) => {
        const subscription = dwSubscription.subscription.subscribe((data) => {
          console.log('got data', data, receiveCount);
          ++receiveCount;
          expect(data.params.data.length).toEqual(1);
          if (dwSubscriptions.length === receiveCount) {
            done();
            subscriptions.forEach((s) => s.unsubscribe());
          }
        });
        subscriptions.push(subscription);
      });

    }));
  });

});
