import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyExtensionComponent } from './company-extension.component';

describe('CompanyExtensionComponent', () => {
  let component: CompanyExtensionComponent;
  let fixture: ComponentFixture<CompanyExtensionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyExtensionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyExtensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
