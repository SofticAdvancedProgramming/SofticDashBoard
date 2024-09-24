import { TestBed } from '@angular/core/testing';

import { SalaryTypeService } from './salary.service';

describe('SalaryTypeService', () => {
  let service: SalaryTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalaryTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
