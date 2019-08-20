import { TestBed } from '@angular/core/testing';

import { DevicewiseMultisubscribeService } from './devicewise-multisubscribe.service';
import { DevicewiseAngularModule } from './devicewise-angular.module';

describe('DevicewiseMultisubscribeService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [DevicewiseAngularModule]
  }));

  it('should be created', () => {
    const service: DevicewiseMultisubscribeService = TestBed.get(DevicewiseMultisubscribeService);
    expect(service).toBeTruthy();
  });
});
