import { TestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DevicewiseAngularModule } from './devicewise-angular.module';
import { DevicewiseAuthService } from './devicewise-auth.service';


describe('DevicewiseAuthService', () => {
  let service: DevicewiseAuthService;
  const endpoint = 'http://localhost:8080';
  const username = 'admin';
  const password = 'admin';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DevicewiseAngularModule],
      providers: [DevicewiseAuthService]
    });
    service = TestBed.get(DevicewiseAuthService);

    if (service.getLoginStatus() === false) {
      service.easyLogin(endpoint, username, password).subscribe((loginResponse) => { }, err => console.log(err));
    }
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('logout should contain success=true', (done: DoneFn) => {
    service.logout().subscribe((logoutResponse) => {
      expect(logoutResponse).toEqual(jasmine.objectContaining({
        success: true
      }));
      done();
    });
  });

  it('login status should be true after login', (done: DoneFn) => {
    expect(service.getLoginStatus()).toEqual(true);

    service.logout().subscribe((logoutResponse) => {
      expect(logoutResponse).toEqual(jasmine.objectContaining({
        success: true
      }));
      done();
    });
  });

  it('login status should be false after logout', (done: DoneFn) => {
    service.easyLogin(endpoint, username, password).subscribe((loginResponse) => {
      expect(loginResponse).toEqual(jasmine.objectContaining({
        success: true
      }));

      service.logout().subscribe((logoutResponse) => {
        expect(logoutResponse).toEqual(jasmine.objectContaining({
          success: true
        }));
        expect(service.getLoginStatus()).toEqual(false);
        done();
      });

    }, err => console.log(err));
  });

});
