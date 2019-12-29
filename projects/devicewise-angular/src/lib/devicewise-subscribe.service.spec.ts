import { TestBed } from '@angular/core/testing';

import { DevicewiseSubscribeService } from './devicewise-subscribe.service';
import { DevicewiseAngularModule } from './devicewise-angular.module';

describe('DevicewiseSubscribeService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [DevicewiseAngularModule]
  }));

  it('should be created', () => {
    const service: DevicewiseSubscribeService = TestBed.get(DevicewiseSubscribeService);
    expect(service).toBeTruthy();
  });
});
