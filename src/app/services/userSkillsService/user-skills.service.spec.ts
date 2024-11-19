import { TestBed } from '@angular/core/testing';

import { UserSkillsService } from './user-skills.service';

describe('UserSkillsService', () => {
  let service: UserSkillsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserSkillsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
