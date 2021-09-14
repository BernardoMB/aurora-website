import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ArticleCommentsComponent } from './article-comments.component';

describe('ArticleCommentsComponent', () => {
  let component: ArticleCommentsComponent;
  let fixture: ComponentFixture<ArticleCommentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
