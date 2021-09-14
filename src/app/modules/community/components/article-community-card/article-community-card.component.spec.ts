import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ArticleCommunityCardComponent } from './article-community-card.component';

describe('ArticleCommunityCardComponent', () => {
  let component: ArticleCommunityCardComponent;
  let fixture: ComponentFixture<ArticleCommunityCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleCommunityCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleCommunityCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
