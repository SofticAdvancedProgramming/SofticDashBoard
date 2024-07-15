import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileManagmentComponent } from './file-managment.component';

describe('FileManagmentComponent', () => {
  let component: FileManagmentComponent;
  let fixture: ComponentFixture<FileManagmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileManagmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
