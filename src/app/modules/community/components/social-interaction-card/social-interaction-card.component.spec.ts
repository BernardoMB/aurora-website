import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SocialInteractionCardComponent } from './social-interaction-card.component';

describe('SocialInteractionCardComponent', () => {
  let component: SocialInteractionCardComponent;
  let fixture: ComponentFixture<SocialInteractionCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialInteractionCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialInteractionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
