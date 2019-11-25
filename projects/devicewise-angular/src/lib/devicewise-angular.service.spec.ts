import { TestBed } from '@angular/core/testing';

import { DevicewiseAngularService } from './devicewise-angular.service';
import { DevicewiseAngularModule } from './devicewise-angular.module';

describe('DevicewiseAngularService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [DevicewiseAngularModule]
  }));

  it('should be created', () => {
    const service: DevicewiseAngularService = TestBed.get(DevicewiseAngularService);
    expect(service).toBeTruthy();
  });
});
