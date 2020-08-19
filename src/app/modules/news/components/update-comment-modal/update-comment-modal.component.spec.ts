import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCommentModalComponent } from './update-comment-modal.component';

describe('UpdateCommentModalComponent', () => {
  let component: UpdateCommentModalComponent;
  let fixture: ComponentFixture<UpdateCommentModalComponent>;

  beforeEach(async(() => {
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
