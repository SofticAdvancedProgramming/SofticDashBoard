import { TestBed } from '@angular/core/testing';

import { BenefitTypeService } from './benefit-type.service';

describe('BenefitTypeService', () => {
  let service: BenefitTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BenefitTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
