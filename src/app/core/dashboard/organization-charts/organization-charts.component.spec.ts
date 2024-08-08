import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationChartsComponent } from './organization-charts.component';

describe('OrganizationChartsComponent', () => {
  let component: OrganizationChartsComponent;
  let fixture: ComponentFixture<OrganizationChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationChartsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
