import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpressionOfInterestModalComponent } from './expression-of-interest-modal.component';

describe('ExpressionOfInterestModalComponent', () => {
  let component: ExpressionOfInterestModalComponent;
  let fixture: ComponentFixture<ExpressionOfInterestModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpressionOfInterestModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpressionOfInterestModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
