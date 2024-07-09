import { TestBed } from '@angular/core/testing';

import { MedicalInsuranceCompanyService } from './medical-insurance-company.service';

describe('MedicalInsuranceCompanyService', () => {
  let service: MedicalInsuranceCompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedicalInsuranceCompanyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
