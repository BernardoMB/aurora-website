import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimatedLogoSpinnerComponentComponent } from './animated-logo-spinner-component.component';

describe('AnimatedLogoSpinnerComponentComponent', () => {
  let component: AnimatedLogoSpinnerComponentComponent;
  let fixture: ComponentFixture<AnimatedLogoSpinnerComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnimatedLogoSpinnerComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimatedLogoSpinnerComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
