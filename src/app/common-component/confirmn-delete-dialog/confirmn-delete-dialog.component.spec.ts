import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmnDeleteDialogComponent } from './confirmn-delete-dialog.component';

describe('ConfirmnDeleteDialogComponent', () => {
  let component: ConfirmnDeleteDialogComponent;
  let fixture: ComponentFixture<ConfirmnDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmnDeleteDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmnDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
