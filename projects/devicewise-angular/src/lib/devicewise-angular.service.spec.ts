import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { CookieService } from 'ngx-cookie-service';
import { forkJoin, Observable } from 'rxjs';
import { DevicewiseAngularService } from './devicewise-angular.service';
import * as DwResponse from './models/dwresponse';
import * as DwReqeust from './models/dwrequest';
import * as DwSubscription from './models/dwsubscription';

describe('DevicewiseAngularService', () => {
  // const url = location.origin;
  const url = 'http://192.168.0.196:88';
  let service: DevicewiseAngularService;

  beforeAll((done: DoneFn) => {
    service = TestBed.get(DevicewiseAngularService);
    service.setEndpoint(url);

    service.easyLogin(url, 'admin', 'admin').subscribe(login => {
      expect(login.success).toBeTruthy('Login failed!');
      done();
    });
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [CookieService]
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be logged in', () => {
    expect(service.getLoginStatus()).toBeTruthy('Not logged in!');
  });

  it('#deviceList should return list of devices', (done: DoneFn) => {
    service.deviceList().subscribe(devices => {
      expect(devices.success).toBeTruthy('deviceList failed!');
      done();
    });
  });

  it('#unsubscribeAll should be successfull', (done: DoneFn) => {
    service.unsubscribeAll().subscribe(unsubscribe => {
      expect(unsubscribe.success).toBeTruthy('unsubscribeAll failed!');
      expect(unsubscribe.params.removed).toBeGreaterThanOrEqual(0);
      done();
    });
  });

  it('#subscribe should return successfully with subscription id', (done: DoneFn) => {
    const variable = new DwSubscription.Subscription('GV_WebInterface', 'OEE_Performance', 9, 1, -1);
    service.getSubscription(variable).subscribe((subscription) => {
      expect(subscription.success).toBeTruthy('subscribe failed!');
      if (!subscription.success) {
        return;
      }
      service.unsubscribe(subscription.params.id).subscribe((unsubscribe) => expect(unsubscribe.success).toBeTruthy('unsubscribe failed!'));
      done();
    });
  });

  it('#subscribe should receive data updates', (done: DoneFn) => {
    const variable = new DwSubscription.Subscription('GV_WebInterface', 'OEE', 9, 1, -1);

    service.getSubscription(variable).subscribe(subscription => {
      expect(subscription.success).toBeTruthy('subscribe failed!');
      if (!subscription.success) {
        return;
      }

      let receiveCount = 0;
      variable.subscription.subscribe(data => {
        expect(data.success).toBeTruthy('notification receive failed!');

        if (++receiveCount >= 2) {
          expect(data.params.data[0]).toBeLessThanOrEqual(100);
          done();
        }
      });

      service.getNotifications();

      const randomValue = Math.random() * 100;
      service
        .write(
          variable.request.params.device,
          variable.request.params.variable,
          variable.request.params.type,
          variable.request.params.count,
          variable.request.params.length,
          String(Math.floor(randomValue * 1000) / 1000)
        )
        .subscribe(write => {
          expect(write.success).toBeTruthy();
        });
    });
  }, 10000);

  it('#subscribe should receive data updates from multiple variables', (done: DoneFn) => {
    const variables: DwSubscription.Subscription[] = [];
    const variableSubscriptions: Observable<DwResponse.Subscribe>[] = [];
    variables.push(new DwSubscription.Subscription('GV_WebInterface', 'OEE_Quality', 9, 1, -1));
    variables.push(new DwSubscription.Subscription('GV_WebInterface', 'OEE_Availability', 9, 1, -1));

    variables.forEach((variable) => {
      variableSubscriptions.push(service.getSubscription(variable));
    });

    forkJoin(variableSubscriptions).subscribe((subscriptions) => {
      subscriptions.forEach((subscription) => {
        expect(subscription.success).toBeTruthy('subscribe failed!');
      });

      variables.forEach((variable) => {
        let receiveCount = 0;
        variable.subscription.subscribe(data => {
          expect(data.success).toBeTruthy('notification receive failed!');
          // service.unsubscribe(subscription.params.id).subscribe(unsubscribe => console.log('unsubscribe sucessful'));

          if (++receiveCount >= 2) {
            expect(data.params.data[0]).toBeLessThanOrEqual(100);
            done();
          }
        });

        const randomValue = Math.random() * 100;
        service
          .write(
            variable.request.params.device,
            variable.request.params.variable,
            variable.request.params.type,
            variable.request.params.count,
            variable.request.params.length,
            String(Math.floor(randomValue * 1000) / 1000)
          )
          .subscribe(write => expect(write.success).toBeTruthy());
      });

      service.getNotifications();

    });
  }, 20000);
});
