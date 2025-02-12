import { Component, Input } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexFill,
  ApexDataLabels,
  ApexLegend
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any[];
  fill: ApexFill;
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-basic-donut-chart',
  standalone: true,
  templateUrl: './basic-donut-chart.component.html',
  styleUrls: ['./basic-donut-chart.component.css'],
  imports: [ChartComponent]
})
export class BasicDonutChartComponent {
  @Input() chartOptions: ChartOptions = {} as ChartOptions;

  constructor() {}

  ngOnInit(): void {
    this.chartOptions = {
      ...this.chartOptions,
      chart: {
        ...this.chartOptions.chart,
        type: 'donut',
        width: 380
      },
      fill: {
        ...this.chartOptions.fill,
        colors: ['#FF9800', '#4CAF50', '#2979FF', '#82B1FF'] // Matching colors from the image
      },
      dataLabels: {
        ...this.chartOptions.dataLabels,
        enabled: false
      },
      legend: {
        position: 'right',
        fontSize: '14px',
        labels: {
          colors: '#000'
        },
        itemMargin: {
          horizontal: 10,
          vertical: 5
        }
      },
      
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: { width: 250 },
            legend: { position: 'bottom' }
          }
        }
      ]
    };
  }
}
