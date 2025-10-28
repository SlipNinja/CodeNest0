import { TestBed } from '@angular/core/testing';

import { UserHandler } from './user-handler';

describe('UserHandler', () => {
  let service: UserHandler;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserHandler);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
