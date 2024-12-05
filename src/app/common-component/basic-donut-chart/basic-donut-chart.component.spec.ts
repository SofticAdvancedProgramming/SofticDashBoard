import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicDonutChartComponent } from './basic-donut-chart.component';

describe('BasicDonutChartComponent', () => {
  let component: BasicDonutChartComponent;
  let fixture: ComponentFixture<BasicDonutChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicDonutChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicDonutChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
