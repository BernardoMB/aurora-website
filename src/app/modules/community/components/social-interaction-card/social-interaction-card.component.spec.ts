import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialInteractionCardComponent } from './social-interaction-card.component';

describe('SocialInteractionCardComponent', () => {
  let component: SocialInteractionCardComponent;
  let fixture: ComponentFixture<SocialInteractionCardComponent>;

  beforeEach(async(() => {
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
