import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IpoModalComponent } from './ipo-modal.component';

describe('IpoModalComponent', () => {
  let component: IpoModalComponent;
  let fixture: ComponentFixture<IpoModalComponent>;

  beforeEach(async(() => {
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
