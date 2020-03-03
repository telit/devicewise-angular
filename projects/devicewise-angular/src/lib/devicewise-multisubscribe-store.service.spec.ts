import { async, TestBed } from '@angular/core/testing';
import { filter, finalize, take } from 'rxjs/operators';
import { DevicewiseAngularModule } from './devicewise-angular.module';
import { DevicewiseAuthService } from './devicewise-auth.service';
import { DevicewiseMultisubscribeStoreService } from './devicewise-multisubscribe-store.service';
import { DwType } from './models/dwcommon';

describe('DevicewiseMultisubscribeStoreService', () => {
  let service: DevicewiseMultisubscribeStoreService;
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
  const variables2: any[] = [
    { device: 'RECIPE', variable: 'PEZZI_CAMERA', type: DwType.INT2, count: 1, length: -1},
    { device: 'CURING', variable: 'PEZZI_CAMERA', type: DwType.INT2, count: 1, length: -1}
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DevicewiseAngularModule],
      providers: [DevicewiseMultisubscribeStoreService, DevicewiseAuthService]
    });
    service = TestBed.get(DevicewiseMultisubscribeStoreService);
    authService = TestBed.get(DevicewiseAuthService);
    if (authService.getSessionInfo() === false) {
      authService.easyLogin(endpoint, username, password).subscribe((data) => { });
    }
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 500000;
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('add variable', () => {
    service.addRequestVariables([variables[0]]);
    const requestVariables = service.getRequestVariables();
    expect(requestVariables.length).toEqual(1);
    expect(requestVariables[0]).toEqual(variables[0]);
  });

  it('add variable', () => {
    service.addRequestVariables([variables[0]]);
    const requestVariables = service.getRequestVariables();
    expect(requestVariables.length).toEqual(1);
    expect(requestVariables[0]).toEqual(variables[0]);
  });

  it('remove variable', () => {
    service.addRequestVariables([variables[0]]);
    let requestVariables = service.getRequestVariables();
    expect(requestVariables.length).toEqual(1);
    expect(requestVariables[0]).toEqual(variables[0]);

    service.removeRequestVariables([variables[0]]);
    requestVariables = service.getRequestVariables();
    expect(requestVariables.length).toEqual(0);
  });

  it('add many variables', () => {
    service.addRequestVariables(variables);
    const requestVariables = service.getRequestVariables();
    expect(requestVariables.length).toEqual(4);
    requestVariables.forEach((variable, index) => {
      expect(variable).toEqual(variables[index]);
    });
  });

  it('remove many variables', () => {
    service.addRequestVariables(variables);
    let requestVariables = service.getRequestVariables();
    expect(requestVariables.length).toEqual(4);
    requestVariables.forEach((variable, index) => {
      expect(variable).toEqual(variables[index]);
    });

    service.removeRequestVariables(variables);
    requestVariables = service.getRequestVariables();
    expect(requestVariables.length).toEqual(0);
  });

  fit('start multisubscribe works', (done: DoneFn) => {
    let messagesReceived = 0;

    const subscription = service.addRequestVariables(variables2).subscribe((data) => {
      console.log('1', data.device, data.variable, data.data);
      ++messagesReceived;
      expect(data.device).toEqual(variables2[0].device);
      expect(data.variable).toEqual(variables2[0].variable);
      expect(data.data.length).toEqual(1);
      expect(data.data.length).toBeGreaterThanOrEqual(0);
      expect(data.data.length).toBeLessThanOrEqual(100);
    });

    setTimeout(() => {
      done();
    }, jasmine.DEFAULT_TIMEOUT_INTERVAL - 1000);
  });

  it('start multisubscribe works', (done: DoneFn) => {
    let messagesReceived = 0;

    const subscription = service.addRequestVariables([variables[0]]).subscribe((data) => {
      console.log(data);
      ++messagesReceived;
      expect(data.device).toEqual(variables[0].device);
      expect(data.variable).toEqual(variables[0].variable);
      expect(data.data.length).toEqual(1);
      expect(data.data.length).toBeGreaterThanOrEqual(0);
      expect(data.data.length).toBeLessThanOrEqual(100);
    });
    const requestVariables = service.getRequestVariables();
    expect(requestVariables.length).toEqual(1);
    expect(requestVariables[0]).toEqual(variables[0]);

    setTimeout(() => {
    }, jasmine.DEFAULT_TIMEOUT_INTERVAL);
  });

  it('add vars then start multisubscribe works', (done: DoneFn) => {
    let messagesReceived = 0;

    const subscription = service.addRequestVariables([variables[0]]).subscribe((data) => {
      ++messagesReceived;
      expect(data.device).toEqual(variables[0].device);
      expect(data.variable).toEqual(variables[0].variable);
      expect(data.data.length).toEqual(1);
      expect(data.data.length).toBeGreaterThanOrEqual(0);
      expect(data.data.length).toBeLessThanOrEqual(100);
    });;
    const requestVariables = service.getRequestVariables();
    expect(requestVariables.length).toEqual(1);
    expect(requestVariables[0]).toEqual(variables[0]);

    setTimeout(() => {
      subscription.unsubscribe();
      expect(subscription.closed).toBeTruthy();
      expect(messagesReceived).toBeGreaterThanOrEqual(requestVariables.length);
      done();
    }, 1000);
  });

  it('start multisubscribe works2', (done: DoneFn) => {
    let subscription2;
    const subscription = service.addRequestVariables([variables[0]]).subscribe((data) => {
      ++messagesReceived;
      expect(data.device).toEqual(variables[0].device);
      expect(data.data.length).toEqual(1);
      expect(data.data.length).toBeGreaterThanOrEqual(0);
      expect(data.data.length).toBeLessThanOrEqual(100);
    });
    let requestVariables = service.getRequestVariables();
    expect(requestVariables.length).toEqual(1);
    expect(requestVariables[0]).toEqual(variables[0]);
    let messagesReceived = 0;

    setTimeout(() => {
      subscription2 = service.addRequestVariables([variables[1]]).subscribe((data) => {
        ++messagesReceived;
        expect(data.device).toEqual(variables[0].device);
        expect(data.data.length).toEqual(1);
        expect(data.data.length).toBeGreaterThanOrEqual(0);
        expect(data.data.length).toBeLessThanOrEqual(100);
      });
      requestVariables = service.getRequestVariables();
      expect(requestVariables.length).toEqual(2);
      expect(requestVariables[1]).toEqual(variables[1]);
    }, 1000);

    setTimeout(() => {
      subscription.unsubscribe();
      expect(subscription.closed).toBeTruthy();
      subscription2.unsubscribe();
      expect(subscription2.closed).toBeTruthy();
      expect(messagesReceived).toBeGreaterThanOrEqual(requestVariables.length);
      done();
    }, 2000);
  });

  it('start multisubscribe works3', (done: DoneFn) => {
    let subscription2;
    const subscription = service.addRequestVariables([variables[0]]).subscribe((data) => {
      console.log('got it', data);
      ++messagesReceived;
      expect(data.device).toEqual(variables[0].device);
      expect(data.data.length).toEqual(1);
      expect(data.data.length).toBeGreaterThanOrEqual(0);
      expect(data.data.length).toBeLessThanOrEqual(100);
    });
    let requestVariables = service.getRequestVariables();
    expect(requestVariables.length).toEqual(1);
    expect(requestVariables[0]).toEqual(variables[0]);
    let messagesReceived = 0;

    setTimeout(() => {
      subscription2 = service.addRequestVariables([variables[0]]).subscribe((data) => {
        console.log('got it2', data);
        ++messagesReceived;
        expect(data.device).toEqual(variables[0].device);
        expect(data.data.length).toEqual(1);
        expect(data.data.length).toBeGreaterThanOrEqual(0);
        expect(data.data.length).toBeLessThanOrEqual(100);
      });
      requestVariables = service.getRequestVariables();
      expect(requestVariables.length).toEqual(1);
      expect(requestVariables[0]).toEqual(variables[0]);
      subscription.unsubscribe();
      expect(subscription.closed).toBeTruthy();
    }, 2000);

    setTimeout(() => {
      subscription2.unsubscribe();
      expect(subscription2.closed).toBeTruthy();
      expect(messagesReceived).toBeGreaterThanOrEqual(requestVariables.length);
      done();
    }, 3000);
  });

  it('start multisubscribe works4', (done: DoneFn) => {
    let subscription2;
    let subscription3;
    const subscription = service.addRequestVariables([variables[0]]).subscribe((data) => {
      console.log('got it', data);
      ++messagesReceived;
      expect(data.device).toEqual(variables[0].device);
      expect(data.data.length).toEqual(1);
      expect(data.data.length).toBeGreaterThanOrEqual(0);
      expect(data.data.length).toBeLessThanOrEqual(100);
    });
    let requestVariables = service.getRequestVariables();
    expect(requestVariables.length).toEqual(1);
    expect(requestVariables[0]).toEqual(variables[0]);
    let messagesReceived = 0;

    setTimeout(() => {
      subscription2 = service.addRequestVariables([variables[0]]).subscribe((data) => {
        console.log('got it2', data);
        ++messagesReceived;
        expect(data.device).toEqual(variables[0].device);
        expect(data.data.length).toEqual(1);
        expect(data.data.length).toBeGreaterThanOrEqual(0);
        expect(data.data.length).toBeLessThanOrEqual(100);
      });
      requestVariables = service.getRequestVariables();
      expect(requestVariables.length).toEqual(1);
      expect(requestVariables[0]).toEqual(variables[0]);
      subscription.unsubscribe();
      expect(subscription.closed).toBeTruthy();
    }, 1000);

    setTimeout(() => {
      subscription3 = service.addRequestVariables([variables[0]]).subscribe((data) => {
        console.log('got it3', data);
        ++messagesReceived;
        expect(data.device).toEqual(variables[0].device);
        expect(data.data.length).toEqual(1);
        expect(data.data.length).toBeGreaterThanOrEqual(0);
        expect(data.data.length).toBeLessThanOrEqual(100);
      });
      requestVariables = service.getRequestVariables();
      expect(requestVariables.length).toEqual(1);
      expect(requestVariables[0]).toEqual(variables[0]);
      subscription2.unsubscribe();
      expect(subscription2.closed).toBeTruthy();
    }, 2000);

    setTimeout(() => {
      subscription3.unsubscribe();
      expect(subscription3.closed).toBeTruthy();
      expect(messagesReceived).toBeGreaterThanOrEqual(requestVariables.length);
      done();
    }, 3000);
  });

  it('start multisubscribe works0', (done: DoneFn) => {
    const subscription = service.addRequestVariables([variables[0]]).subscribe((data) => {
      console.log('got it', data);
      ++messagesReceived;
      expect(data.device).toEqual(variables[0].device);
      expect(data.data.length).toEqual(1);
      expect(data.data.length).toBeGreaterThanOrEqual(0);
      expect(data.data.length).toBeLessThanOrEqual(100);
    });
    const requestVariables = service.getRequestVariables();
    expect(requestVariables.length).toEqual(1);
    expect(requestVariables[0]).toEqual(variables[0]);
    let messagesReceived = 0;

    setTimeout(() => {
      subscription.unsubscribe();
      expect(subscription.closed).toBeTruthy();
      expect(messagesReceived).toBeGreaterThanOrEqual(requestVariables.length);
      done();
    }, 3000);
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
    }, 2000);
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
      expect(data.data.length).toEqual(1);
      expect(data.data.length).toBeGreaterThanOrEqual(0);
      expect(data.data.length).toBeLessThanOrEqual(100);
    });

    setTimeout(() => {
      subscription.unsubscribe();
      expect(subscription.closed).toBeTruthy();

      const subscription2 = service.subscriptionAsObservable().subscribe((data) => {
        expect(data.device).toEqual(variables[0].device);
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

  it('add vars, sub, unsub, resub', (done: DoneFn) => {
    const subscription1 = service.addRequestVariables([variables[0]]).subscribe((data) => {
      console.log('1', data);
      expect(data.device).toEqual(variables[0].device);
      expect(data.data.length).toEqual(1);
      expect(data.data.length).toBeGreaterThanOrEqual(0);
      expect(data.data.length).toBeLessThanOrEqual(100);
    });
    let requestVariables = service.getRequestVariables();
    expect(requestVariables.length).toEqual(1);
    expect(requestVariables[0]).toEqual(variables[0]);

    const subscription2 = service.addRequestVariables([variables[0]]).subscribe((data) => {
      console.log('2', data);
      expect(data.device).toEqual(variables[0].device);
      expect(data.data.length).toEqual(1);
      expect(data.data.length).toBeGreaterThanOrEqual(0);
      expect(data.data.length).toBeLessThanOrEqual(100);
    });
    requestVariables = service.getRequestVariables();
    expect(requestVariables.length).toEqual(1);
    expect(requestVariables[0]).toEqual(variables[0]);

    setTimeout(() => {
      console.log('UNSUBSCRIBE 1');
      subscription1.unsubscribe();
      expect(subscription1.closed).toBeTruthy();

      requestVariables = service.getRequestVariables();
      expect(requestVariables.length).toEqual(1);
      expect(requestVariables[0]).toEqual(variables[0]);

      setTimeout(() => {
        console.log('UNSUBSCRIBE 2');
        subscription2.unsubscribe();
        const subscription3 = service.addRequestVariables([variables[1]]).subscribe((data) => {
          console.log('3', data);
          expect(data.device).toEqual(variables[1].device);
          expect(data.data.length).toEqual(1);
          expect(data.data.length).toBeGreaterThanOrEqual(0);
          expect(data.data.length).toBeLessThanOrEqual(100);
        });
        expect(subscription2.closed).toBeTruthy();

        requestVariables = service.getRequestVariables();
        expect(requestVariables.length).toEqual(1);
        expect(requestVariables[0]).toEqual(variables[1]);

        done();
      }, 2000);
    }, 2000);
  });

  it('start multisubscribe works', (done: DoneFn) => {
    service.addRequestVariables([variables[0]]);
    const requestVariables = service.getRequestVariables();
    expect(requestVariables.length).toEqual(1);
    expect(requestVariables[0]).toEqual(variables[0]);

    const subscription = service.subscriptionAsObservable();

    subscription.pipe(
      take(1)
    ).subscribe((data) => {
      expect(data.device).toEqual(variables[0].device);
      expect(data.variable).toEqual(variables[0].variable);
      expect(data.data.length).toEqual(1);
      expect(data.data.length).toBeGreaterThanOrEqual(0);
      expect(data.data.length).toBeLessThanOrEqual(100);
    });

    subscription.pipe(
      take(2),
      finalize(() => done())
    ).subscribe((data) => {
      expect(data.device).toEqual(variables[0].device);
      expect(data.variable).toEqual(variables[0].variable);
      expect(data.data.length).toEqual(1);
      expect(data.data.length).toBeGreaterThanOrEqual(0);
      expect(data.data.length).toBeLessThanOrEqual(100);
    });
  });

  it('start multisubscribe and add variables', (done: DoneFn) => {
    service.addRequestVariables([variables[0]]);
    let requestVariables = service.getRequestVariables();
    expect(requestVariables.length).toEqual(1);
    expect(requestVariables[0]).toEqual(variables[0]);

    let messagesReceived = 0;
    const subscription = service.subscriptionAsObservable().subscribe((data) => {
      expect(data.device).toEqual(variables[0].device);
      expect(data.data.length).toEqual(1);
      expect(data.data.length).toBeGreaterThanOrEqual(0);
      expect(data.data.length).toBeLessThanOrEqual(100);
      ++messagesReceived;
    });

    setTimeout(() => {
      service.addRequestVariables([variables[1]]);
      requestVariables = service.getRequestVariables();
      expect(requestVariables.length).toEqual(2);
      expect(requestVariables[1]).toEqual(variables[1]);
    }, 500);

    setTimeout(() => {
      expect(messagesReceived).toBeGreaterThan(2);
      subscription.unsubscribe();
      expect(subscription.closed).toBeTruthy();
      done();
    }, 1000);
  });

  it('stop multisubscribe works', (done: DoneFn) => {
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
      subscription.unsubscribe();
      expect(subscription.closed).toBeTruthy();
      done();
    });
  });

  it('invalid multisubscribe request', (done: DoneFn) => {
    const invalidVariable = JSON.parse(JSON.stringify(variables[0]));
    invalidVariable.variable = invalidVariable.variable + '1234';
    service.addRequestVariables([invalidVariable]);
    const requestVariables = service.getRequestVariables();
    expect(requestVariables.length).toEqual(1);
    expect(requestVariables[0]).toEqual(invalidVariable);

    const subscription = service.subscriptionAsObservable().subscribe({
      next: null,
      error: (err) => {
        expect(err.success).toEqual(false);
        expect(err.errorCodes).toBeLessThan(-1);
        expect(err.errorMessages.length).toBeGreaterThan(0);
        subscription.unsubscribe();
        done();
      }
    });
  });

  it('invalid multisubscribe request multi var', (done: DoneFn) => {
    const invalidVariable = JSON.parse(JSON.stringify(variables[0]));
    const invalidVariable2 = JSON.parse(JSON.stringify(variables[0]));
    invalidVariable.variable = invalidVariable.variable + '1234';
    invalidVariable2.variable = invalidVariable.variable + '1234';

    service.addRequestVariables([invalidVariable, invalidVariable2]);
    const requestVariables = service.getRequestVariables();
    expect(requestVariables.length).toEqual(2);
    expect(requestVariables[0]).toEqual(invalidVariable);
    expect(requestVariables[1]).toEqual(invalidVariable2);

    const subscription = service.subscriptionAsObservable().subscribe({
      next: null,
      error: (err) => {
        expect(err.success).toEqual(false);
        expect(err.errorCodes).toBeLessThan(-1);
        expect(err.errorMessages.length).toBeGreaterThan(0);
        subscription.unsubscribe();
        done();
      }
    });
  });

});
