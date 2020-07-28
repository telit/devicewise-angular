import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecuteSqlComponent } from './execute-sql.component';

describe('ExecuteSqlComponent', () => {
  let component: ExecuteSqlComponent;
  let fixture: ComponentFixture<ExecuteSqlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecuteSqlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecuteSqlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
