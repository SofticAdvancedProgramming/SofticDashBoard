import { TestBed } from '@angular/core/testing';

import { UserSocialService } from './user-social.service';

describe('UserSocialService', () => {
  let service: UserSocialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserSocialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
