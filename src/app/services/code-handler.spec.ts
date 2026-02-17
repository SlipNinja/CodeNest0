import { TestBed } from '@angular/core/testing';

import { CodeHandler } from './code-handler';

describe('CodeHandler', () => {
  let service: CodeHandler;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CodeHandler);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
