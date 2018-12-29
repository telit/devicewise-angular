import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicewiseTestComponent } from './devicewise-test.component';

describe('DevicewiseTestComponent', () => {
  let component: DevicewiseTestComponent;
  let fixture: ComponentFixture<DevicewiseTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevicewiseTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicewiseTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
