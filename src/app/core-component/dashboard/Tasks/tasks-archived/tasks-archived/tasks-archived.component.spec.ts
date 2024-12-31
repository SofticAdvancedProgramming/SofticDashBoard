import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksArchivedComponent } from './tasks-archived.component';

describe('TasksArchivedComponent', () => {
  let component: TasksArchivedComponent;
  let fixture: ComponentFixture<TasksArchivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksArchivedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksArchivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
