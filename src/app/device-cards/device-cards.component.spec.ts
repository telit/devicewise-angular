import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceCardsComponent } from './device-cards.component';

describe('DeviceCardsComponent', () => {
  let component: DeviceCardsComponent;
  let fixture: ComponentFixture<DeviceCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
