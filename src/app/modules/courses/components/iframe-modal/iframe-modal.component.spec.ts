import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IframeModalComponent } from './iframe-modal.component';

describe('IframeModalComponent', () => {
  let component: IframeModalComponent;
  let fixture: ComponentFixture<IframeModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IframeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IframeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
