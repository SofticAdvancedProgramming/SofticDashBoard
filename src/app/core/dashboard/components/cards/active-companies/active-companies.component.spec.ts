import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveCompaniesComponent } from './active-companies.component';

describe('ActiveCompaniesComponent', () => {
  let component: ActiveCompaniesComponent;
  let fixture: ComponentFixture<ActiveCompaniesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveCompaniesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
