import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteConfirmationPopUpComponent } from './delete-confirmation-pop-up.component';

describe('DeleteConfirmationPopUpComponent', () => {
  let component: DeleteConfirmationPopUpComponent;
  let fixture: ComponentFixture<DeleteConfirmationPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteConfirmationPopUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteConfirmationPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
