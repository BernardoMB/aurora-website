import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterPinModalComponent } from './enter-pin-modal.component';

describe('EnterPinModalComponent', () => {
  let component: EnterPinModalComponent;
  let fixture: ComponentFixture<EnterPinModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterPinModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterPinModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
