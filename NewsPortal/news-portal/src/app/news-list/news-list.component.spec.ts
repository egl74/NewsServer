import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsListComponent } from './news-list.component';
import { NewsEntityComponent } from '../news-entity/news-entity.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('NewsListComponent', () => {
  let component: NewsListComponent;
  let fixture: ComponentFixture<NewsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsListComponent, NewsEntityComponent ],
      imports: [RouterTestingModule, HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
