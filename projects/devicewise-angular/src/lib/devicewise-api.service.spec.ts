import { TestBed } from '@angular/core/testing';

import { DevicewiseApiService } from './devicewise-api.service';

describe('DevicewiseApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DevicewiseApiService = TestBed.get(DevicewiseApiService);
    expect(service).toBeTruthy();
  });
});
