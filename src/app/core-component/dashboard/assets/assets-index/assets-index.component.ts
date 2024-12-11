import { Component, OnInit } from '@angular/core';
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
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AssetsService } from '../../../../services/AssetsService/assets.service';

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
  imports: [BasicLineChartComponent, NgApexchartsModule, BasicDonutChartComponent, RouterLink]
})
export class AssetsIndexComponent{
  constructor(private assetsService: AssetsService){
    this.getAssetsCount();
    this.getAssetsPerCategoriesCount();
  }

  assetsCount!:{
    companyId: number,
    totalAssetsCount: number,
    notInServiceAssetsCount: number,
    assignedAssetsCount: number,
    unassignedAssetsCount: number
  }

  assetsInCategoriesCount:{
    name: string,
    nameAr: string,
    count: number
  }[]=[]
  assetsCategoryInArabic:string[]=[]
  assetsCategoryInEnglish:string[]=[]
  assetsInCatCount:number[]=[];
  isAssined:boolean=true;
  getAssetsCount(){
    const req=null;
    this.assetsService.getAssetsCount(req).subscribe(
      {
        next:(res)=>{
         console.log(res)
          this.assetsCount={
            companyId:res.companyId,
            totalAssetsCount:res.totalAssetsCount,
            notInServiceAssetsCount:res.notInServiceAssetsCount,
            assignedAssetsCount: res.assignedAssetsCount,
            unassignedAssetsCount: res.unassignedAssetsCount
          }
        },
        error:(res)=>{
         // console.log(res)
        }
      }
    )
  }

  getAssetsPerCategoriesCount(){
    const req=null;
    this.assetsService.AssetCategorycounts(req).subscribe(
      {
        next:(res)=>{
          //console.log(res)

          this.assetsInCategoriesCount=res;
          res.map((item:any)=>{
            this.assetsCategoryInArabic.push(item.nameAr);
            this.assetsCategoryInEnglish.push(item.name);
            this.assetsInCatCount.push(item.count);
          }
        )
       // console.log(this.assetsCategoryInArabic)
       // console.log( this.assetsCategoryInEnglish)
       // console.log(this.assetsInCatCount)
        },

        error:(res)=>{
          console.log(res)
        }
      }
    )
  }


  // Bar Chart Options
  barChartOptions = {
    series: [
      {
        name: 'Assets',
        data: [31, 40, 28]
      }
    ],
    chart: {
      type: 'bar' as ChartType,
      height: 300
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '25%',
        borderRadius: 10
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 0,
      colors: ['transparent']
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar']
    },
    yaxis: {
      title: {
        text: 'Assets Count'
      }
    },
    fill: {
      opacity: 1,
      colors: ['#FF4560', '#00E396', '#fff']  // Specify different colors for each bar
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
    //series: [44, 55, 41, 17, 15],
    series:  this.assetsInCatCount,
    chart: {
      width: 380,
      type: 'donut' as ChartType
    },
 //   labels: ['Category 1', 'Category 2', 'Category 3'],
    labels: this.isArabic?this.assetsCategoryInArabic:this.assetsCategoryInEnglish,
    dataLabels: {
      enabled: false
    },
    fill: {
      type: 'gradient'
    },
    legend: {
      formatter: function (val: any, opts: any) {
        return `${val} - ${opts.w.globals.series[opts.seriesIndex]}`;
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


  get isArabic(): boolean {
    return localStorage.getItem('lang') === 'ar';
  }
}
