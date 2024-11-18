import { TestBed } from '@angular/core/testing';

import { RequestLockupService } from './request-lockup.service';

describe('RequestLockupService', () => {
  let service: RequestLockupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestLockupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
