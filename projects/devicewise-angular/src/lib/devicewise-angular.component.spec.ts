import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicewiseAngularComponent } from './devicewise-angular.component';
import { CookieService } from 'ngx-cookie-service';
import { DevicewiseAngularModule } from './devicewise-angular.module';

describe('DevicewiseAngularComponent', () => {
  let component: DevicewiseAngularComponent;
  let fixture: ComponentFixture<DevicewiseAngularComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DevicewiseAngularModule],
      declarations: [ ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicewiseAngularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
