import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
  NgApexchartsModule
} from 'ng-apexcharts';
import { CommonModule } from '@angular/common';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};

@Component({
  selector: 'app-basic-line-chart',
  standalone: true,
  templateUrl: './basic-line-chart.component.html',
  styleUrls: ['./basic-line-chart.component.css'],
  imports: [CommonModule, NgApexchartsModule],
})
export class BasicLineChartComponent implements OnInit {
  @ViewChild('chart') chart?: ChartComponent;
  @Input() chartOptions!: ChartOptions; // Allow dynamic input

  constructor() {}

  ngOnInit(): void {
    // Merge styles without overriding incoming data
    this.chartOptions = {
      ...this.chartOptions, // Keep existing data
      chart: {
        ...this.chartOptions.chart,
        type: 'bar',
        height: 350
      },
      plotOptions: {
        bar: {
          borderRadius: 8, // Rounded bars
          columnWidth: '45%', // Adjust width
          distributed: true // Allow different colors per bar
        }
      },
      stroke: {
        show: false
      },
      xaxis: {
        ...this.chartOptions.xaxis,
        labels: {
          ...this.chartOptions.xaxis?.labels,
          style: {
            fontSize: '14px',
            fontWeight: 'bold'
          }
        }
      },
      yaxis: {
        ...this.chartOptions.yaxis,
        labels: {
          formatter: function (val) {
            return val + 'K'; // Display values as "30K"
          },
          style: {
            fontSize: '12px',
            fontWeight: 'bold'
          }
        }
      },
      fill: {
        colors: this.chartOptions.fill?.colors || ['#E57373', '#4CAF50', '#FFB74D'] // Use input colors or default ones
      },
      tooltip: {
        enabled: true,
        theme: 'dark'
      },
      legend: {
        show: false
      }
    };
  }
}