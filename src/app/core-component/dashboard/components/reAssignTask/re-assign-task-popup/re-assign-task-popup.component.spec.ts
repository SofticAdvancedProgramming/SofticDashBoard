import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReAssignTaskPopupComponent } from './re-assign-task-popup.component';

describe('ReAssignTaskPopupComponent', () => {
  let component: ReAssignTaskPopupComponent;
  let fixture: ComponentFixture<ReAssignTaskPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReAssignTaskPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReAssignTaskPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
