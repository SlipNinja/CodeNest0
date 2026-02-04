import { TestBed } from '@angular/core/testing';

import { DataValidator } from './data-validator';

describe('DataValidator', () => {
  let service: DataValidator;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataValidator);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
