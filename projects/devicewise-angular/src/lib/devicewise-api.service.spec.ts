import { ReferenceList } from './models/dwresponse';
import { forkJoin } from 'rxjs';
import { DwType } from './models/dwconstants';
import { DevicewiseAngularService } from './devicewise-angular.service';
import { DevicewiseAngularModule } from './devicewise-angular.module';
import { TestBed, async } from '@angular/core/testing';

import { DevicewiseApiService } from './devicewise-api.service';
import { DwRequest } from 'dist/devicewise-angular/public_api';

describe('DevicewiseApiService', () => {
  let service: DevicewiseApiService;
  let authService: DevicewiseAngularService;
  const endpoint = 'http://localhost:88';
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
      providers: [DevicewiseApiService, DevicewiseAngularService]
    });
    service = TestBed.get(DevicewiseApiService);
    authService = TestBed.get(DevicewiseAngularService);
    if (authService.getLoginStatus() === false) {
      authService.easyLogin(endpoint, username, password).subscribe((data) => { });
    }
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('set endpoint and then get endpoint should give same value', () => {
    service.setEndpoint(endpoint);
    expect(service.getEndpoint()).toBe(endpoint);
  });

  it('logout', (done: DoneFn) => {
    service.logout().subscribe(((logoutResponse) => {
      expect(logoutResponse).toEqual(jasmine.objectContaining({
        success: true
      }));
      done();
    }));
  });

  it('login, read', (done: DoneFn) => {
    service.deviceStart(variables[0].device).subscribe(((deviceStartResponse) => {
      variables.forEach((variable) => {
        service.read(variable.device, variable.variable, variable.type, variable.count, variable.length).subscribe(((readResponse) => {
          expect(readResponse).toEqual(jasmine.objectContaining({
            success: true
          }));
          expect(readResponse.params.data.length).toEqual(1);
          expect(readResponse.params.data[0]).toBeGreaterThanOrEqual(0);
          expect(readResponse.params.data[0]).toBeLessThanOrEqual(100);
          done();
        }));
      });
    }));
  });

  // it('login and write', (done: DoneFn) => {
  //   authService.easyLogin(endpoint, username, password).subscribe((data) => {
  //     variables.forEach((variable) => {
  //       const randomNumber = Math.floor(Math.random() * 100);
  //       service.write(
  //         variable.device, variable.variable, variable.type, variable.count, variable.length, randomNumber
  //       ).subscribe(((writeResponse) => {
  //         expect(writeResponse).toEqual(jasmine.objectContaining({
  //           success: true
  //         }));
  //         done();
  //       }));
  //     });
  //   });
  // });

  it('login, write and read', (done: DoneFn) => {
    const writeRequests = [];
    const randomNumbers = [];
    let writesComplete = 0;

    service.deviceStart(variables[0].device).subscribe(((deviceStartResponse) => {
      variables.forEach((variable, index) => {
        const randomNumber = Math.floor(Math.random() * 100);
        randomNumbers[index] = randomNumber;

        const writeRequest = service.write(
          variable.device, variable.variable, variable.type, variable.count, variable.length, randomNumber
        );
        writeRequests.push(writeRequest);
      });

      forkJoin(writeRequests).subscribe(((writeResponses) => {

        writeResponses.forEach((writeResponse, index) => {
          const variable = variables[index];

          expect(writeResponse).toEqual(jasmine.objectContaining({
            success: true
          }));

          service.read(
            variable.device, variable.variable, variable.type, variable.count, variable.length
          ).subscribe(((readResponse) => {
            expect(readResponse).toEqual(jasmine.objectContaining({
              success: true
            }));
            expect(readResponse.params.data.length).toEqual(1);
            expect(readResponse.params.data[0]).toEqual(randomNumbers[index]);
            ++writesComplete;
            if (writeRequests.length === writesComplete) {
              done();
            }
          }));

        });

      }));

    }));
  });

  it('login, get device list', (done: DoneFn) => {
    service.deviceList().subscribe(((deviceListResponse) => {
      expect(deviceListResponse).toEqual(jasmine.objectContaining({
        success: true
      }));
      expect(deviceListResponse.params.devices.length).toBeGreaterThan(1);
      done();
    }));
  });

  it('login and get started device info', (done: DoneFn) => {
    service.deviceList().subscribe(((deviceListResponse) => {
      expect(deviceListResponse).toEqual(jasmine.objectContaining({
        success: true
      }));
      expect(deviceListResponse.params.devices.length).toBeGreaterThan(1);

      const startedDevices = deviceListResponse.params.devices.filter((device) => device.state === 1);
      expect(startedDevices.length).toBeGreaterThan(1);

      startedDevices.forEach((startedDevice) => {
        service.deviceInfo(startedDevice.name, 0).subscribe((deviceInfoResponse) => {
          expect(deviceInfoResponse).toEqual(jasmine.objectContaining({
            success: true
          }));

          expect(deviceInfoResponse.params.name).toEqual(startedDevice.name);
          expect(deviceInfoResponse.params.state).toEqual(startedDevice.state);
          expect(deviceInfoResponse.params.type).toEqual(startedDevice.type);
          expect(deviceInfoResponse.params.options).toEqual(startedDevice.options);

          done();
        });
      });

    }));
  });

  it('login and get device type list', (done: DoneFn) => {
    service.deviceTypeList().subscribe(((deviceTypeListResponse) => {
      expect(deviceTypeListResponse).toEqual(jasmine.objectContaining({
        success: true
      }));
      expect(deviceTypeListResponse.params.deviceTypes.length).toBeGreaterThan(1);
      done();
    }));
  });

  it('login and stop/start device', (done: DoneFn) => {
    service.deviceStart(variables[0].device).subscribe(((deviceStartResponse) => {
      service.deviceStop(variables[0].device).subscribe(((deviceStopResponse) => {
        expect(deviceStopResponse).toEqual(jasmine.objectContaining({
          success: true
        }));
        done();
      }));
    }));
  });

  // it('login and start/stop device', (done: DoneFn) => {
  //   authService.easyLogin(endpoint, username, password).subscribe((data) => {
  //     service.deviceStop(variables[0].device).subscribe(((deviceStopResponse) => {
  //       service.deviceStart(variables[0].device).subscribe(((deviceStartResponse) => {
  //         expect(deviceStartResponse).toEqual(jasmine.objectContaining({
  //           success: true
  //         }));
  //         done();
  //       }));
  //     }));
  //   });
  // });


  it('login, get trigger list', (done: DoneFn) => {
    service.triggerList('OEE').subscribe(((triggerListResponse) => {
      expect(triggerListResponse).toEqual(jasmine.objectContaining({
        success: true
      }));
      expect(triggerListResponse.params.triggers.length).toBeGreaterThan(1);
      done();
    }));
  });

  it('login, start trigger, stop trigger', (done: DoneFn) => {
    service.triggerStart('OEE', 'OEE').subscribe(((triggerStartResponse) => {
      service.triggerStop('OEE', 'OEE').subscribe(((triggerStopResponse) => {
        expect(triggerStopResponse).toEqual(jasmine.objectContaining({
          success: true
        }));
        done();
      }));
    }));
  });

  // it('login, get action list', (done: DoneFn) => {
  //   authService.easyLogin(endpoint, username, password).subscribe((data) => {
  //     service.actionTypeList().subscribe(((triggerListResponse) => {
  //       expect(triggerListResponse).toEqual(jasmine.objectContaining({
  //         success: true
  //       }));
  //       expect(triggerListResponse.params.actionTypes.length).toBeGreaterThan(1);
  //       done();
  //     }));
  //   });
  // });


  // it('login, get event list', (done: DoneFn) => {
  //   authService.easyLogin(endpoint, username, password).subscribe((data) => {
  //     service.eventTypeList().subscribe(((triggerListResponse) => {
  //       expect(triggerListResponse).toEqual(jasmine.objectContaining({
  //         success: true
  //       }));
  //       expect(triggerListResponse.params.eventTypes.length).toBeGreaterThan(1);
  //       done();
  //     }));
  //   });
  // });

  it('login, get project list', (done: DoneFn) => {
    service.projectList().subscribe(((triggerListResponse) => {
      expect(triggerListResponse).toEqual(jasmine.objectContaining({
        success: true
      }));
      expect(triggerListResponse.params.projects.length).toBeGreaterThan(1);
      done();
    }));
  });

  it('login, send sql', (done: DoneFn) => {
    service.sql('SELECT name FROM sqlite_master WHERE type=\'table\'').subscribe(((triggerListResponse) => {
      expect(triggerListResponse).toEqual(jasmine.objectContaining({
        success: true
      }));
      expect(triggerListResponse.params.count).toBeGreaterThan(1);
      done();
    }));
  });

  it('login, reference list', (done: DoneFn) => {
    service.referenceList('user', 'admin', '2').subscribe(((triggerListResponse) => {
      expect(triggerListResponse).toEqual(jasmine.objectContaining({
        success: true
      }));
      done();
    }));
  });

  it('login, ping', (done: DoneFn) => {
    service.ping('localhost', 5).subscribe(((pingResponse) => {
      expect(pingResponse).toEqual(jasmine.objectContaining({
        success: true
      }));
      expect(pingResponse.params.pings.length).toEqual(5);
      done();
    }));
  });

  it('dw string to number', () => {
    expect(DwType.INT1).toEqual(service.dwTypeToNumber('INT1'));
  });

  it('dw type to string', () => {
    expect('INT1').toEqual(service.dwTypeToString(DwType.INT1));
  });

});
