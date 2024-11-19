import { TestBed } from '@angular/core/testing';

import { UserEducationService } from './user-education.service';

describe('UserEducationService', () => {
  let service: UserEducationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserEducationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
