import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ArticleDetailCommentsComponent } from './article-detail-comments.component';

describe('ArticleDetailCommentsComponent', () => {
  let component: ArticleDetailCommentsComponent;
  let fixture: ComponentFixture<ArticleDetailCommentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleDetailCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleDetailCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
