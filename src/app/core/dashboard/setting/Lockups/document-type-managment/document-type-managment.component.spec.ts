import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentTypeManagmentComponent } from './document-type-managment.component';

describe('DocumentTypeManagmentComponent', () => {
  let component: DocumentTypeManagmentComponent;
  let fixture: ComponentFixture<DocumentTypeManagmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentTypeManagmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentTypeManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
