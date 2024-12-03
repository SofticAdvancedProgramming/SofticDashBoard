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
  imports: [ChartComponent] // Import ChartComponent from ng-apexcharts
})
export class BasicDonutChartComponent {
  @Input() chartOptions: ChartOptions = {
    series: [44, 55, 41, 17, 15],
    chart: { type: 'donut', width: 380 },
    labels: ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5'],
    dataLabels: { enabled: false },
    fill: { type: 'gradient' },
    legend: {
      formatter: (val, opts) => `${val} - ${opts.w.globals.series[opts.seriesIndex]}`
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { width: 200 },
          legend: { position: 'bottom' }
        }
      }
    ]
  }; // Initialize with default values

  constructor() {}
}
