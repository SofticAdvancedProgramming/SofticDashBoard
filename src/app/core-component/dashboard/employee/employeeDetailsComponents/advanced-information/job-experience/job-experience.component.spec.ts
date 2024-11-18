import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobExperienceComponent } from './job-experience.component';

describe('JobExperienceComponent', () => {
  let component: JobExperienceComponent;
  let fixture: ComponentFixture<JobExperienceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobExperienceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
