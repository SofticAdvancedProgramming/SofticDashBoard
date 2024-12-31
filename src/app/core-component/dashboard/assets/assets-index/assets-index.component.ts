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
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule, DatePipe } from '@angular/common';
import { LocalStorageService } from '../../../../services/local-storage-service/local-storage.service';

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
  imports: [BasicLineChartComponent, NgApexchartsModule, BasicDonutChartComponent, RouterLink,TranslateModule,DatePipe,CommonModule],
})
export class AssetsIndexComponent{
  constructor(
      private assetsService: AssetsService,
      private translate: TranslateService,
      private localStorage:LocalStorageService){
        this.companyId = Number(localStorage.getItem('companyId'));
        this.getAssetsCount();
        this.getAssetsPerCategoriesCount();
        this.getAssetCountPerLastThreeMonths();
  }

  date :Date =new Date()
  companyId: number = 0;
  assetsCount!:{
    companyId: number,
    totalAssetsCount: number,
    outOfServiceDepreciationCount: number,
    assignedAssetsCount: number,
    unassignedAssetsCount: number
  }

  assetsInCategoriesCount:{
    name: string,
    nameAr: string,
    count: number
  }[]=[]
  assetCountPerLastThreeMonths:{
    month: string,
    monthAr: string,
    assetCount: number
  }[]=[]
  assetsCategoryInArabic:string[]=[]
  assetsCategoryInEnglish:string[]=[]
  assetsInCatCount:number[]=[];
  assetCountPerLastThreeMonthsInArabic:string[]=[]
  assetCountPerLastThreeMonthsInEnglish:string[]=[]
  assetCountPerLastThreeMonthsCount:number[]=[];
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
            outOfServiceDepreciationCount:res.outOfServiceDepreciationCount,
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
    const req={
      companyId:this.companyId
    };
    this.assetsService.AssetCategorycounts(req).subscribe(
      {
        next:(res)=>{
          this.assetsInCategoriesCount=res;
          res.map((item:any)=>{
            this.assetsCategoryInArabic.push(item.nameAr);
            this.assetsCategoryInEnglish.push(item.name);
            this.assetsInCatCount.push(item.count);
          }
        )
        },

        error:(res)=>{
          console.log(res)
        }
      }
    )
  }


  getAssetCountPerLastThreeMonths(){
    const req={
      companyId:this.companyId
    };
    this.assetsService.GetAssetCountPerLastThreeMonths(req).subscribe(
      {
        next:(res)=>{
          this.assetCountPerLastThreeMonths=res;
          res.data.map((item:any)=>{
            this.assetCountPerLastThreeMonthsInArabic.push(item.month);
            this.assetCountPerLastThreeMonthsInEnglish.push(item.month);
            this.assetCountPerLastThreeMonthsCount.push(item.assetCount);
          }
        )
        },

        error:(res)=>{
          console.log(res)
        }
      }
    )
  }

  get isArabic(): boolean {
    return localStorage.getItem('lang') === 'ar';
  }

  // Bar Chart Options
  barChartOptions = {
    series: [
      {
        name: 'Assets',
        data: this.assetCountPerLastThreeMonthsCount
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
      categories: this.assetCountPerLastThreeMonthsInEnglish
    },
    yaxis: {
      title: {
        text: 'Assets Count',
        style: {
          fontFamily: 'lama sans',
        },
      }
    },
    fill: {
      opacity: 1,
      colors: ['#FF4560', '#00FFFF', '#ffff00']  // Specify different colors for each bar
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
  barChartOptionsAr = {
    series: [
      {
        name: 'الأصول',
        data: this.assetCountPerLastThreeMonthsCount
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
        borderRadius: 10,
        colors: {
          ranges: [], // Leave empty if not using range-based coloring
          backgroundBarColors: [], // Optional for background bar colors
          backgroundBarOpacity: 0.5,
          distributed: true // Enables different colors for each bar
        }
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
      categories:this.assetCountPerLastThreeMonthsInArabic
    },
    yaxis: {
      title: {
        text: 'أعداد الأصول',
        style: {
          fontFamily: 'lama sans',
        },
      }
    },
    fill: {
      opacity: 1,
      colors: ['#FD0000','#9ACA3C','#FF9560']  // Specify different colors for each bar
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
    labels: this.assetsCategoryInEnglish,
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
  donutChartOptionsAr = {
    //series: [44, 55, 41, 17, 15],
    series:  this.assetsInCatCount,
    chart: {
      width: 380,
      type: 'donut' as ChartType
    },
 //   labels: ['Category 1', 'Category 2', 'Category 3'],
    labels: this.assetsCategoryInArabic,
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
}
