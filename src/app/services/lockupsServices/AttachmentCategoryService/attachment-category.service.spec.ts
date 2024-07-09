import { TestBed } from '@angular/core/testing';

import { AttachmentCategoryService } from './attachment-category.service';

describe('AttachmentCategoryService', () => {
  let service: AttachmentCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttachmentCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
