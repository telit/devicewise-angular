import { TestBed } from '@angular/core/testing';

import { DevicewiseMiscService } from './devicewise-misc.service';

describe('DevicewiseMiscService', () => {
  let service: DevicewiseMiscService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DevicewiseMiscService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
