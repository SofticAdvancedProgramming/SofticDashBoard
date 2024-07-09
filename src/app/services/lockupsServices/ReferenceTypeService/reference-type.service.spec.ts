import { TestBed } from '@angular/core/testing';

import { ReferenceTypeService } from './reference-type.service';

describe('ReferenceTypeService', () => {
  let service: ReferenceTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReferenceTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
