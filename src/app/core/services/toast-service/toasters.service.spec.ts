import { TestBed } from '@angular/core/testing';

import { ToastersService } from './toast.service';

describe('ToastersService', () => {
  let service: ToastersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
