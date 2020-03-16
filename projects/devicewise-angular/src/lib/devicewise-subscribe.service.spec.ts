import { TestBed, async } from '@angular/core/testing';

import { DevicewiseSubscribeService } from './devicewise-subscribe.service';
import { DevicewiseAngularModule } from './devicewise-angular.module';
import { DwType, DwVariable } from './models/dwcommon';
import { DevicewiseAuthService } from './devicewise-auth.service';
import { switchMap } from 'rxjs/operators';
import { DwSubscription } from './models/dwsubscription';

fdescribe('DevicewiseSubscribeService', () => {
  let service: DevicewiseSubscribeService;
  let authService: DevicewiseAuthService;
  const endpoint = 'http://localhost:8080';
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
      providers: [DevicewiseSubscribeService, DevicewiseAuthService]
    });
    service = TestBed.inject(DevicewiseSubscribeService);
    authService = TestBed.inject(DevicewiseAuthService);
    authService.easyLogin(endpoint, username, password).subscribe((data) => { });
  }));

  it('should be created', () => {
    const _service: DevicewiseSubscribeService = TestBed.inject(DevicewiseSubscribeService);
    expect(_service).toBeTruthy();
  });

  it('should be able to subscribe to observable once', (done: DoneFn) => {
    const sub: DwSubscription = new DwSubscription('OEE', 'Availability', DwType.FLOAT4, 1, -1);
    authService.easyLogin('http://localhost:8080', 'admin', 'admin').pipe(
      switchMap((e) => service.unsubscribeAll()),
      switchMap((e) => service.getSubscription(sub))
    ).subscribe((e) => {
      console.log('GOT SUBSCRIPTION:', JSON.stringify(e));
      sub.subscription.subscribe((d) => console.log('GOT DATA:', JSON.stringify(d)));
      service.getNotifications();
    });
  });
});
