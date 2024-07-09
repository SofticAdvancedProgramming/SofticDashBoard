import { TestBed } from '@angular/core/testing';

import { LifeStyleTypeService } from './life-style-type.service';

describe('LifeStyleTypeService', () => {
  let service: LifeStyleTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LifeStyleTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
