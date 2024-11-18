import { TestBed } from '@angular/core/testing';

import { AdditionalEducationService } from './additional-education.service';

describe('AdditionalEducationService', () => {
  let service: AdditionalEducationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdditionalEducationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
