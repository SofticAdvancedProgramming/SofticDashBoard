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
import { BasicDonutChartComponent } from "../../../../common-component/basic-donut-chart/basic-donut-chart.component";
import { RouterLink } from '@angular/router';

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
    styleUrls: ['./assets-index.component.css'],
    imports: [BasicLineChartComponent, NgApexchartsModule, BasicDonutChartComponent,RouterLink]
})
export class AssetsIndexComponent {

  // Bar Chart Options
  barChartOptions = {
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

  donutChartOptions = {
    series: [44, 55, 41, 17, 15],  
    chart: {
      width: 380,
      type: 'donut' as ChartType  
    },
    labels: ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5'],  
    dataLabels: {
      enabled: false
    },
    fill: {
      type: 'gradient' // Gradient fill
    },
    legend: {
      formatter: function(val: any, opts: any) {
        return `${val} - ${opts.w.globals.series[opts.seriesIndex]}`; // Legend formatter
      }
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ]
  };
}