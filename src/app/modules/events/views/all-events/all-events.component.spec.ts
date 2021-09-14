import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AllEventsComponent } from './all-events.component';

describe('AllEventsComponent', () => {
  let component: AllEventsComponent;
  let fixture: ComponentFixture<AllEventsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AllEventsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
