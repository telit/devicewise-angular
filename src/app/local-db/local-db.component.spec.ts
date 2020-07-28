import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalDbComponent } from './local-db.component';

describe('LocalDbComponent', () => {
  let component: LocalDbComponent;
  let fixture: ComponentFixture<LocalDbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalDbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalDbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
