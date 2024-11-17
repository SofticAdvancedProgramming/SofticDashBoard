import { TestBed } from '@angular/core/testing';

import { UserAttachmentsService } from './user-attachments.service';

describe('UserAttachmentsService', () => {
  let service: UserAttachmentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserAttachmentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
