import { TestBed } from '@angular/core/testing';

import { DevicewiseSubscribeService } from './devicewise-subscribe.service';

describe('DevicewiseSubscribeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DevicewiseSubscribeService = TestBed.get(DevicewiseSubscribeService);
    expect(service).toBeTruthy();
  });
});
