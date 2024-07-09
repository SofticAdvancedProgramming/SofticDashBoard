import { TestBed } from '@angular/core/testing';

import { SkillsTypeService } from './skills-type.service';

describe('SkillsTypeService', () => {
  let service: SkillsTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkillsTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
