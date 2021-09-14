import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EventSwiperCardComponent } from './event-swiper-card.component';

describe('EventSwiperCardComponent', () => {
  let component: EventSwiperCardComponent;
  let fixture: ComponentFixture<EventSwiperCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EventSwiperCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventSwiperCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
