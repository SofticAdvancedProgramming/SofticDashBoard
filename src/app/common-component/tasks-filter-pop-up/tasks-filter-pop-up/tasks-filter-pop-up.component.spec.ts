import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksFilterPopUpComponent } from './tasks-filter-pop-up.component';

describe('TasksFilterPopUpComponent', () => {
  let component: TasksFilterPopUpComponent;
  let fixture: ComponentFixture<TasksFilterPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksFilterPopUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksFilterPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
