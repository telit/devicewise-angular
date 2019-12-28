import { TestBed } from '@angular/core/testing';

import { DevicewiseApiService } from './devicewise-api.service';
import { DevicewiseAngularModule } from './devicewise-angular.module';
import { DwType } from './models/dwconstants';

describe('DevicewiseApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DevicewiseAngularModule]
    });
  });

  it('should be created', () => {
    const dw: DevicewiseApiService = TestBed.get(DevicewiseApiService);
    expect(dw).toBeTruthy();
  });

  it('set endpoint should set endpoint', () => {
    const dw: DevicewiseApiService = TestBed.get(DevicewiseApiService);
    const endpoint = '';
    dw.setEndpoint(endpoint);
    expect(dw.getEndpoint()).toEqual(endpoint);
  });

  it('valid read should be sucessful', () => {
    const dw: DevicewiseApiService = TestBed.get(DevicewiseApiService);
    dw.read('global device', 'int4', DwType.INT4, 1, -1).subscribe((response) => {
      expect(response.success).toBeTruthy();
    });
  });

  it('invalid read should fail', () => {
    const dw: DevicewiseApiService = TestBed.get(DevicewiseApiService);
    dw.read('abc', 'int4', DwType.INT4, 1, -1).subscribe((response) => {
      expect(response.success).toBeTruthy();
    });
  });

  it('invalid read should fail', () => {
    const dw: DevicewiseApiService = TestBed.get(DevicewiseApiService);
    dw.read('abc', 'int4', DwType.INT4, 1, -1).subscribe((response) => {
      console.log(response);
      expect(response.success).toBeFalsy();
    });
  });
});
