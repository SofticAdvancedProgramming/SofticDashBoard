import { ComponentFixture, TestBed } from '@angular/core/testing';

import { medicalInsuranceCompanyManagmentComponent } from './medical-insurance-company-managment.component';

describe('InsuranceCompanyManagmentComponent', () => {
  let component: medicalInsuranceCompanyManagmentComponent;
  let fixture: ComponentFixture<medicalInsuranceCompanyManagmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [medicalInsuranceCompanyManagmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(medicalInsuranceCompanyManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
