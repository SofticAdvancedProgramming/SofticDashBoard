import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationManagmentComponent } from './education-managment.component';

describe('EducationManagmentComponent', () => {
  let component: EducationManagmentComponent;
  let fixture: ComponentFixture<EducationManagmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EducationManagmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EducationManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
