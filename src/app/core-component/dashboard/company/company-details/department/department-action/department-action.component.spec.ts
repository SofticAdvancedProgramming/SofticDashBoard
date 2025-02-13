import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentActionComponent } from './department-action.component';

describe('DepartmentActionComponent', () => {
  let component: DepartmentActionComponent;
  let fixture: ComponentFixture<DepartmentActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentActionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
