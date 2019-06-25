import { TestBed } from '@angular/core/testing';

import { DevicewiseMultisubscribeService } from './devicewise-multisubscribe.service';

describe('DevicewiseMultisubscribeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DevicewiseMultisubscribeService = TestBed.get(DevicewiseMultisubscribeService);
    expect(service).toBeTruthy();
  });
});
