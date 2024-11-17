import { TestBed } from '@angular/core/testing';

import { IssueExcuterService } from './issue-excuter.service';

describe('IssueExcuterService', () => {
  let service: IssueExcuterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IssueExcuterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
