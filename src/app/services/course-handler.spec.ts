import { TestBed } from '@angular/core/testing';

import { CourseHandler } from './course-handler';

describe('CourseHandler', () => {
  let service: CourseHandler;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseHandler);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
