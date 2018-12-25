import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicewiseAngularComponent } from './devicewise-angular.component';

describe('DevicewiseAngularComponent', () => {
  let component: DevicewiseAngularComponent;
  let fixture: ComponentFixture<DevicewiseAngularComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevicewiseAngularComponent ]
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
