import { async, TestBed } from '@angular/core/testing';
import { DevicewiseAuthService } from './devicewise-auth.service';
import { switchMap } from 'rxjs/operators';

import { NewSubscribeService } from './new-subscribe.service';
import { DevicewiseAngularModule } from './devicewise-angular.module';
import { DwType } from './models/dwcommon';
import { MultiSubscribeResponse } from 'dist/devicewise-angular/lib/devicewise-multisubscribe.service';
import { HttpEventType } from '@angular/common/http';

fdescribe('NewSubscribeService', () => {
  let service: NewSubscribeService;
  let authService: DevicewiseAuthService;
  const endpoint = 'http://localhost:8080';
  const username = 'admin';
  const password = 'admin';
  const variables: any[] = [
    { device: 'Simulation', variable: 'Counter 100', type: DwType.INT1, count: 1, length: -1 },
    { device: 'Simulation', variable: 'Counter 1000', type: DwType.INT2, count: 1, length: -1 },
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DevicewiseAngularModule],
      providers: [NewSubscribeService, DevicewiseAuthService]
    });
    service = TestBed.inject(NewSubscribeService);
    authService = TestBed.inject(DevicewiseAuthService);
    if (authService.getLoginStatus() === false) {
      authService.easyLogin(endpoint, username, password).subscribe((data) => { });
    }
    // jasmine.DEFAULT_TIMEOUT_INTERVAL = 500000;
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be able to subscribe to observable once', (done: DoneFn) => {
    authService.easyLogin(endpoint, 'admin', 'admin').pipe(
      switchMap((e) => service.multiSubscribe(variables))
    ).subscribe({
      next: (e) => {
        let obj: MultiSubscribeResponse;
        let bytesToRead = 0;
        let charactersToRead = 0;
        let bytesToReadStringLength = 0;

        console.log('GOT DATA:', e);
        if (e.type === HttpEventType.DownloadProgress) {
          let text = e['partialText'];
          if (isNaN((bytesToRead = parseInt(text, 10)))) {
          } else {
            bytesToReadStringLength = bytesToRead.toString().length;

            const payload = e['partialText'].substr(bytesToReadStringLength, bytesToRead);
            console.log(payload);

            e['partialText'] = e['partialText'].substr(bytesToReadStringLength + bytesToRead);
            // console.log(bytesToReadStringLength + bytesToRead, e['partialText']);
          }
        }

      },
      error: (err) => console.warn('ERROR:', err),
      complete: () => done()
    });
  });
});
