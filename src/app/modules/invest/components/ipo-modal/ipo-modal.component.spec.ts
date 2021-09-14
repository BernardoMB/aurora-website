import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IpoModalComponent } from './ipo-modal.component';

describe('IpoModalComponent', () => {
  let component: IpoModalComponent;
  let fixture: ComponentFixture<IpoModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IpoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IpoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
