import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsEntityInfoComponent } from './news-entity-info.component';

describe('NewsEntityInfoComponent', () => {
  let component: NewsEntityInfoComponent;
  let fixture: ComponentFixture<NewsEntityInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsEntityInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsEntityInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
