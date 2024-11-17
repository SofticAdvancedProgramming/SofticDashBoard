import { TestBed } from '@angular/core/testing';

import { UserJobExperienceService } from './user-job-experience.service';

describe('UserJobExperienceService', () => {
  let service: UserJobExperienceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserJobExperienceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
