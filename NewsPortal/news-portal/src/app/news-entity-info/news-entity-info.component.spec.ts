import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsEntityInfoComponent } from './news-entity-info.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('NewsEntityInfoComponent', () => {
  let component: NewsEntityInfoComponent;
  let fixture: ComponentFixture<NewsEntityInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewsEntityInfoComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule],
      providers: [{ provide: ActivatedRoute, useValue: {
        snapshot: { params: { id: '' } }} }]
    }).compileComponents();
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
