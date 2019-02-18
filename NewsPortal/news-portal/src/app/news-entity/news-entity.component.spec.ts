import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsEntityComponent } from './news-entity.component';

describe('NewsEntityComponent', () => {
  let component: NewsEntityComponent;
  let fixture: ComponentFixture<NewsEntityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsEntityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
