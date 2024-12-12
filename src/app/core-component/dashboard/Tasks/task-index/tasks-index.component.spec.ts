import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksIndexComponent } from './tasks-index.component';

describe('TasksIndexComponent', () => {
  let component: TasksIndexComponent;
  let fixture: ComponentFixture<TasksIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
