import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentCategoryManagmentComponent } from './attachment-category-managment.component';

describe('AttachmentCategoryManagmentComponent', () => {
  let component: AttachmentCategoryManagmentComponent;
  let fixture: ComponentFixture<AttachmentCategoryManagmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttachmentCategoryManagmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttachmentCategoryManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
