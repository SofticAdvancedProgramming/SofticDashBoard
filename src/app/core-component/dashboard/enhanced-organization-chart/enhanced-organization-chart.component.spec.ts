import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnhancedOrganizationChartComponent } from './enhanced-organization-chart.component';

describe('EnhancedOrganizationChartComponent', () => {
  let component: EnhancedOrganizationChartComponent;
  let fixture: ComponentFixture<EnhancedOrganizationChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnhancedOrganizationChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnhancedOrganizationChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
