import { TestBed } from '@angular/core/testing';

import { DevicewiseAngularService } from './devicewise-angular.service';

describe('DevicewiseAngularService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DevicewiseAngularService = TestBed.get(DevicewiseAngularService);
    expect(service).toBeTruthy();
  });
});
