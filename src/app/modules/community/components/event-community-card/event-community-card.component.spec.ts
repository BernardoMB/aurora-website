import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCommunityCardComponent } from './event-community-card.component';

describe('EventCommunityCardComponent', () => {
  let component: EventCommunityCardComponent;
  let fixture: ComponentFixture<EventCommunityCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventCommunityCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventCommunityCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
