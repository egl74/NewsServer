import { TestBed, inject } from '@angular/core/testing';

import { NewsService } from './news.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('NewsEntityServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewsService],
      imports: [RouterTestingModule, HttpClientTestingModule]
    });
  });

  it('should be created', inject([NewsService], (service: NewsService) => {
    expect(service).toBeTruthy();
  }));
});
