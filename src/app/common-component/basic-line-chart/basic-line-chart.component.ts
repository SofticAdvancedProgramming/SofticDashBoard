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
  NgApexchartsModule,
  ChartType  
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
  
  @Input() chartOptions: ChartOptions = {} as ChartOptions;  // Enforce non-optional input
  
  constructor() {}

  ngOnInit(): void {
    // Provide default values for missing chart options
    this.chartOptions = {
      series: this.chartOptions.series || [],
      chart: this.chartOptions.chart || {
        type: 'bar',
        height: 350
      },
      
      plotOptions: this.chartOptions.plotOptions || {
        bar: {
          horizontal: false,
          columnWidth: '55%',
        }
      },
      dataLabels: this.chartOptions.dataLabels || {
        enabled: false
      },
      stroke: this.chartOptions.stroke || {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: this.chartOptions.xaxis || {
        categories: []
      },
      yaxis: this.chartOptions.yaxis || {
        title: {
          text: '$ (thousands)'
        }
      },
      fill: this.chartOptions.fill || {
        opacity: 1
      },
      tooltip: this.chartOptions.tooltip || {
        y: {
          formatter: function (val) {
            return '$ ' + val + ' thousands';
          }
        }
      },
      legend: this.chartOptions.legend || {},  // Ensure `legend` is also initialized
    };
  }
}
