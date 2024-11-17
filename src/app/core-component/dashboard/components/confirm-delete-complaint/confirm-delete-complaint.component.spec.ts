import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteComplaintComponent } from './confirm-delete-complaint.component';

describe('ConfirmDeleteComplaintComponent', () => {
  let component: ConfirmDeleteComplaintComponent;
  let fixture: ComponentFixture<ConfirmDeleteComplaintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDeleteComplaintComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmDeleteComplaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
