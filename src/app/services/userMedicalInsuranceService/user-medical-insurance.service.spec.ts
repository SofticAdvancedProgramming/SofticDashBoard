import { TestBed } from '@angular/core/testing';

import { UserMedicalInsuranceService } from './user-medical-insurance.service';

describe('UserMedicalInsuranceService', () => {
  let service: UserMedicalInsuranceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserMedicalInsuranceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
