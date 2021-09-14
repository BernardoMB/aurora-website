import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AmpPlayerComponent } from './amp-player.component';

describe('AmpPlayerComponent', () => {
  let component: AmpPlayerComponent;
  let fixture: ComponentFixture<AmpPlayerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AmpPlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmpPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
