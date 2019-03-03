import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsEntityComponent } from './news-entity.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('NewsEntityComponent', () => {
  let component: NewsEntityComponent;
  let fixture: ComponentFixture<NewsEntityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsEntityComponent ],
      imports: [RouterTestingModule, HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsEntityComponent);
    component = fixture.componentInstance;
    component.newsEntity = { "_id" : "5c794eec699a3a1264b3214f", "author" : "Sarah Gray", "title" : "Biden praises Trump for 'walking away' from the North Korea summit with no nuclear deal", "description" : "But he also said the president can't treat everything like a \"real-estate deal.\"", "url" : "https://www.businessinsider.com/biden-praises-trump-for-walking-away-from-north-korea-summit-2019-2", "urlToImage" : "https://amp.businessinsider.com/images/5c78cb1c2628985ef87df873-1920-960.jpg", "publishedAt" : "2019-03-01T00:00:00Z", "__v" : 0 };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
