import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighSchoolComponent } from './education.component';

describe('EducationComponent', () => {
  let component: HighSchoolComponent;
  let fixture: ComponentFixture<HighSchoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HighSchoolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HighSchoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
