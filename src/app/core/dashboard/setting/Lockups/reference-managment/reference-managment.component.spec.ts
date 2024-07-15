import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceManagmentComponent } from './reference-managment.component';

describe('ReferenceManagmentComponent', () => {
  let component: ReferenceManagmentComponent;
  let fixture: ComponentFixture<ReferenceManagmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferenceManagmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferenceManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
