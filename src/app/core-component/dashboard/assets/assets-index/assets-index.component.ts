import { Component } from '@angular/core';
import { ChartType, NgApexchartsModule } from 'ng-apexcharts'; 
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
  ChartComponent
} from 'ng-apexcharts';
import { BasicLineChartComponent } from "../../../../common-component/basic-line-chart/basic-line-chart.component";
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
    selector: 'app-assets-index',
    standalone: true,
    templateUrl: './assets-index.component.html',
    styleUrl: './assets-index.component.css',
    imports: [BasicLineChartComponent,NgApexchartsModule]
})
export class AssetsIndexComponent {

  chartOptions = {
    series: [
      {
        name: 'Assets',
        data: [31, 40, 28, 51, 42, 109, 100]
      }
    ],
    chart: {
      type: 'bar' as ChartType,  
      height: 350
    },
    plotOptions: {
      bar: {
        horizontal: false,   
        columnWidth: '20%'
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
    },
    yaxis: {
      title: {
        text: 'Assets Count'
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val: any) {
          return `${val} assets`;
        }
      }
    },
    legend: {
      show: true
    }
  };
  
}