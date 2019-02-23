import { TestBed, inject } from '@angular/core/testing';

import { NewsEntityServiceService } from './news-entity-service.service';

describe('NewsEntityServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewsEntityServiceService]
    });
  });

  it('should be created', inject([NewsEntityServiceService], (service: NewsEntityServiceService) => {
    expect(service).toBeTruthy();
  }));
});
