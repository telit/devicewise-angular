import { DevicewiseAngularModule } from './devicewise-angular.module';
import { DwType } from './models/dwconstants';
import { DevicewiseAngularService } from './devicewise-angular.service';
import { DevicewiseMultisubscribeStoreService } from './devicewise-multisubscribe-store.service';
import { TestBed, async } from '@angular/core/testing';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

fdescribe('DevicewiseMultisubscribeStoreService', () => {
  let service: DevicewiseMultisubscribeStoreService;
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
      providers: [DevicewiseMultisubscribeStoreService, DevicewiseAngularService]
    });
    service = TestBed.get(DevicewiseMultisubscribeStoreService);
    authService = TestBed.get(DevicewiseAngularService);
    if (authService.getLoginStatus() === false) {
      authService.easyLogin(endpoint, username, password).subscribe((data) => { });
    }
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // it('add variable', () => {
  //   service.addRequestVariables([variables[0]]);
  //   const requestVariables = service.getRequestVariables();
  //   expect(requestVariables.length).toEqual(1);
  //   expect(requestVariables[0]).toEqual(variables[0]);
  // });

  // it('remove variable', () => {
  //   service.addRequestVariables([variables[0]]);
  //   let requestVariables = service.getRequestVariables();
  //   expect(requestVariables.length).toEqual(1);
  //   expect(requestVariables[0]).toEqual(variables[0]);

  //   service.removeRequestVariables([variables[0]]);
  //   requestVariables = service.getRequestVariables();
  //   expect(requestVariables.length).toEqual(0);
  // });

  // it('add many variables', () => {
  //   service.addRequestVariables(variables);
  //   const requestVariables = service.getRequestVariables();
  //   expect(requestVariables.length).toEqual(4);
  //   requestVariables.forEach((variable, index) => {
  //     expect(variable).toEqual(variables[index]);
  //   });
  // });

  // it('remove many variables', () => {
  //   service.addRequestVariables(variables);
  //   let requestVariables = service.getRequestVariables();
  //   expect(requestVariables.length).toEqual(4);
  //   requestVariables.forEach((variable, index) => {
  //     expect(variable).toEqual(variables[index]);
  //   });

  //   service.removeRequestVariables(variables);
  //   requestVariables = service.getRequestVariables();
  //   expect(requestVariables.length).toEqual(0);
  // });


  it('start multisubscribe works', (done: DoneFn) => {
    service.addRequestVariables([variables[0]]);
    const requestVariables = service.getRequestVariables();
    expect(requestVariables.length).toEqual(1);
    expect(requestVariables[0]).toEqual(variables[0]);

    const subscription = service.subscriptionAsObservable().subscribe((data) => {
      expect(data.device).toEqual(variables[0].device);
      expect(data.variable).toEqual(variables[0].variable);
      expect(data.data.length).toEqual(1);
      expect(data.data.length).toBeGreaterThanOrEqual(0);
      expect(data.data.length).toBeLessThanOrEqual(100);
    });

    setTimeout(() => {
      subscription.unsubscribe();
      expect(subscription.closed).toBeTruthy();
      done();
    }, 1000);
  });

  it('add vars, sub, add more vars', (done: DoneFn) => {
    service.addRequestVariables([variables[0]]);
    let requestVariables = service.getRequestVariables();
    expect(requestVariables.length).toEqual(1);
    expect(requestVariables[0]).toEqual(variables[0]);

    const subscription1 = service.subscriptionAsObservable().pipe(
      filter((data) => data.variable === variables[0].variable)
    ).subscribe((data) => {
      expect(data.device).toEqual(variables[0].device);
      expect(data.variable).toEqual(variables[0].variable);
      expect(data.data.length).toEqual(1);
      expect(data.data.length).toBeGreaterThanOrEqual(0);
      expect(data.data.length).toBeLessThanOrEqual(100);
    });

    const subscription2 = service.subscriptionAsObservable().pipe(
      filter((data) => data.variable === variables[1].variable)
    ).subscribe((data) => {
      expect(data.device).toEqual(variables[1].device);
      expect(data.variable).toEqual(variables[1].variable);
      expect(data.data.length).toEqual(1);
      expect(data.data.length).toBeGreaterThanOrEqual(0);
      expect(data.data.length).toBeLessThanOrEqual(100);
    });

    setTimeout(() => {
      service.addRequestVariables([variables[1]]);
      requestVariables = service.getRequestVariables();
      expect(requestVariables.length).toEqual(2);
      expect(requestVariables[1]).toEqual(variables[1]);
    }, 1000);

    setTimeout(() => {
      subscription1.unsubscribe();
      expect(subscription1.closed).toBeTruthy();
      subscription2.unsubscribe();
      expect(subscription2.closed).toBeTruthy();
      done();
    }, 3000);
  });

  it('add vars, sub, add more vars, remove vars', (done: DoneFn) => {
    service.addRequestVariables([variables[0]]);
    let requestVariables = service.getRequestVariables();
    expect(requestVariables.length).toEqual(1);
    expect(requestVariables[0]).toEqual(variables[0]);

    const subscription1 = service.subscriptionAsObservable().pipe(
      filter((data) => data.variable === variables[0].variable)
    ).subscribe((data) => {
      expect(data.device).toEqual(variables[0].device);
      expect(data.variable).toEqual(variables[0].variable);
      expect(data.data.length).toEqual(1);
      expect(data.data.length).toBeGreaterThanOrEqual(0);
      expect(data.data.length).toBeLessThanOrEqual(100);
    });

    const subscription2 = service.subscriptionAsObservable().pipe(
      filter((data) => data.variable === variables[1].variable)
    ).subscribe((data) => {
      expect(data.device).toEqual(variables[1].device);
      expect(data.variable).toEqual(variables[1].variable);
      expect(data.data.length).toEqual(1);
      expect(data.data.length).toBeGreaterThanOrEqual(0);
      expect(data.data.length).toBeLessThanOrEqual(100);
    });

    setTimeout(() => {
      service.addRequestVariables([variables[1]]);
      requestVariables = service.getRequestVariables();
      expect(requestVariables.length).toEqual(2);
      expect(requestVariables[1]).toEqual(variables[1]);
    }, 1000);

    setTimeout(() => {
      service.removeRequestVariables([variables[1]]);
      requestVariables = service.getRequestVariables();
      expect(requestVariables.length).toEqual(1);
      expect(requestVariables[0]).toEqual(variables[0]);
    }, 2000);

    setTimeout(() => {
      subscription1.unsubscribe();
      expect(subscription1.closed).toBeTruthy();
      subscription2.unsubscribe();
      expect(subscription2.closed).toBeTruthy();
      done();
    }, 3000);
  });

  it('add vars, sub, unsub, resub', (done: DoneFn) => {
    service.addRequestVariables([variables[0]]);
    const requestVariables = service.getRequestVariables();
    expect(requestVariables.length).toEqual(1);
    expect(requestVariables[0]).toEqual(variables[0]);

    const subscription = service.subscriptionAsObservable().subscribe((data) => {
      expect(data.device).toEqual(variables[0].device);
      expect(data.variable).toEqual(variables[0].variable);
      expect(data.data.length).toEqual(1);
      expect(data.data.length).toBeGreaterThanOrEqual(0);
      expect(data.data.length).toBeLessThanOrEqual(100);
    });

    setTimeout(() => {
      subscription.unsubscribe();
      expect(subscription.closed).toBeTruthy();

      const subscription2 = service.subscriptionAsObservable().subscribe((data) => {
        expect(data.device).toEqual(variables[0].device);
        expect(data.variable).toEqual(variables[0].variable);
        expect(data.data.length).toEqual(1);
        expect(data.data.length).toBeGreaterThanOrEqual(0);
        expect(data.data.length).toBeLessThanOrEqual(100);
      });

      setTimeout(() => {
        subscription2.unsubscribe();
        expect(subscription2.closed).toBeTruthy();
        done();
      }, 1000);
    }, 1000);
  });

  // it('start multisubscribe works', (done: DoneFn) => {
  //   service.addRequestVariables([variables[0]]);
  //   const requestVariables = service.getRequestVariables();
  //   expect(requestVariables.length).toEqual(1);
  //   expect(requestVariables[0]).toEqual(variables[0]);

  //   const subscription = service.subscriptionAsObservable();

  //   subscription.subscribe((data) => {
  //     console.log('observable hit!');
  //     expect(data.device).toEqual(variables[0].device);
  //     expect(data.variable).toEqual(variables[0].variable);
  //     expect(data.data.length).toEqual(1);
  //     expect(data.data.length).toBeGreaterThanOrEqual(0);
  //     expect(data.data.length).toBeLessThanOrEqual(100);
  //     done();
  //   });

  //   subscription.subscribe((data) => {
  //     console.log('observable hit!');
  //     expect(data.device).toEqual(variables[0].device);
  //     expect(data.variable).toEqual(variables[0].variable);
  //     expect(data.data.length).toEqual(1);
  //     expect(data.data.length).toBeGreaterThanOrEqual(0);
  //     expect(data.data.length).toBeLessThanOrEqual(100);
  //     done();
  //   });
  // });

  // it('start multisubscribe and add variables', (done: DoneFn) => {
  //   service.addRequestVariables([variables[0]]);
  //   let requestVariables = service.getRequestVariables();
  //   expect(requestVariables.length).toEqual(1);
  //   expect(requestVariables[0]).toEqual(variables[0]);

  //   let messagesReceived = 0;
  //   const subscription = service.subscriptionAsObservable().subscribe((data) => {
  //     expect(data.device).toEqual(variables[0].device);
  //     expect(data.variable).toEqual(variables[0].variable);
  //     expect(data.data.length).toEqual(1);
  //     expect(data.data.length).toBeGreaterThanOrEqual(0);
  //     expect(data.data.length).toBeLessThanOrEqual(100);
  //     ++messagesReceived;
  //     if (messagesReceived === 2) {
  //       subscription.unsubscribe();
  //       expect(subscription.closed).toBeTruthy();
  //       done();
  //     }
  //   });

  // setTimeout(() => {
  //   service.addRequestVariables([variables[1]]);
  //   requestVariables = service.getRequestVariables();
  //   expect(requestVariables.length).toEqual(2);
  //   expect(requestVariables[1]).toEqual(variables[1]);
  // }, 500);
  // });

  // it('stop multisubscribe works', (done: DoneFn) => {
  //   service.addRequestVariables([variables[0]]);
  //   const requestVariables = service.getRequestVariables();
  //   expect(requestVariables.length).toEqual(1);
  //   expect(requestVariables[0]).toEqual(variables[0]);

  //   const subscription = service.startMultisubscribe().subscribe((data) => {
  //     expect(data.device).toEqual(variables[0].device);
  //     expect(data.variable).toEqual(variables[0].variable);
  //     expect(data.data.length).toEqual(1);
  //     expect(data.data.length).toBeGreaterThanOrEqual(0);
  //     expect(data.data.length).toBeLessThanOrEqual(100);
  //     subscription.unsubscribe();
  //     expect(subscription.closed).toBeTruthy();
  //     done();
  //   });
  // });

});
