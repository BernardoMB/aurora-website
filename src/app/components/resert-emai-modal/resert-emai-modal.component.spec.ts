import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ResertEmaiModalComponent } from './resert-emai-modal.component';

describe('ResertEmaiModalComponent', () => {
  let component: ResertEmaiModalComponent;
  let fixture: ComponentFixture<ResertEmaiModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ResertEmaiModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResertEmaiModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
