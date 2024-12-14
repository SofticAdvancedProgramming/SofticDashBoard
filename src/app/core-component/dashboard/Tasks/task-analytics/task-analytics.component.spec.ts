import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskAnalyticsComponent } from './task-analytics.component';

describe('TaskAnalyticsComponent', () => {
  let component: TaskAnalyticsComponent;
  let fixture: ComponentFixture<TaskAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskAnalyticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
