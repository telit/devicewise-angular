import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DevicewiseAngularModule } from './devicewise-angular.module';
import { DevicewiseAngularService } from './devicewise-angular.service';


describe('DevicewiseAngularService', () => {
  let service: DevicewiseAngularService;
  const endpoint = 'http://192.168.1.19:88';
  const username = 'admin';
  const password = 'admin';

  beforeAll(() => {
    console.log('before all');
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DevicewiseAngularModule],
      providers: [DevicewiseAngularService]
    });
    service = TestBed.get(DevicewiseAngularService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('login and logout should contain success=true', (done: DoneFn) => {
    service.easyLogin(endpoint, username, password).subscribe((loginResponse) => {
      expect(loginResponse).toEqual(jasmine.objectContaining({
        success: true
      }));

      service.logout().subscribe((logoutResponse) => {
        expect(logoutResponse).toEqual(jasmine.objectContaining({
          success: true
        }));
        done();
      });

    }, err => console.log(err));
  });

  it('login and get login status is true', (done: DoneFn) => {
    service.easyLogin(endpoint, username, password).subscribe((loginResponse) => {
      expect(loginResponse).toEqual(jasmine.objectContaining({
        success: true
      }));

      expect(service.getLoginStatus()).toEqual(true);

      service.logout().subscribe((logoutResponse) => {
        expect(logoutResponse).toEqual(jasmine.objectContaining({
          success: true
        }));
        done();
      });

    }, err => console.log(err));
  });

  it('logout and get login status is false', (done: DoneFn) => {
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
