import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToDoProgressBarComponent } from './to-do-progress-bar.component';

describe('ToDoProgressBarComponent', () => {
  let component: ToDoProgressBarComponent;
  let fixture: ComponentFixture<ToDoProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToDoProgressBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToDoProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
