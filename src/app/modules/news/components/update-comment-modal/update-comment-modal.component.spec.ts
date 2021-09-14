import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UpdateCommentModalComponent } from './update-comment-modal.component';

describe('UpdateCommentModalComponent', () => {
  let component: UpdateCommentModalComponent;
  let fixture: ComponentFixture<UpdateCommentModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateCommentModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCommentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
