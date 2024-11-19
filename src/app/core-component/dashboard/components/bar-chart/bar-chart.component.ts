import { Component, ViewEncapsulation, ViewChild, Input, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { ChartComponent, ChartTheme, IPointRenderEventArgs, ChartAllModule } from '@syncfusion/ej2-angular-charts';
import { Browser } from '@syncfusion/ej2-base';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [ChartAllModule, CommonModule]
})
export class BarChartComponent implements OnChanges {
  @ViewChild('chart') public chart!: ChartComponent;
  @Input() public data: Object[] = [];
  @Input() public title: string = 'Chart Title';
  @Input() public xName: string = 'x';
  @Input() public yName: string = 'y';
  @Input() public tooltipMappingName: string = 'tooltip';
  @Input() public backgroundColor: string = '#ffffff';
  @Input() public barWidth: number = 0.8;
  @Input() public chartData: any ;

  public primaryXAxis: Object = {
    valueType: 'Category',
    labelIntersectAction: Browser.isDevice ? 'None' : 'Rotate45',
    labelStyle: { fontFamily: 'Nunito, sans-serif' }
  };
  public primaryYAxis: Object = {
    labelFormat: '{value}',
    title: '',
    labelStyle: { fontFamily: 'Nunito, sans-serif' }
  };
  public tooltip: Object = {
    enable: true,
    textStyle: { fontFamily: 'Nunito, sans-serif' }
  };
  public titleStyle: Object = { fontFamily: 'Nunito, sans-serif' };

  public chartArea: Object = {
    border: { width: 0 }
  };

  public legend: Object = {
    visible: false,
    textStyle: { fontFamily: 'Nunito, sans-serif' }
  };

  public highlightColor: string = 'transparent';
  public placement: boolean = false;
  public width: string = '100%';
  public radius: Object = {
    bottomLeft: 0,
    bottomRight: 0,
    topLeft: 10,
    topRight: 10
  };

  public marker: Object = {
    dataLabel: {
      visible: true,
      position: 'Top',
      name: 'Text',
      enableRotation: Browser.isDevice ? true : false,
      angle: -90,
      font: { fontWeight: '600', color: '#ffffff', fontFamily: 'Nunito, sans-serif' },
    }
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && !changes['data'].firstChange) {
      this.chart.refresh();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.width = window.innerWidth <= 767 ? '100%' : '75%';
    this.chart.refresh();
  }

  public load(args: any): void {
    const selectedTheme: string = location.hash.split('/')[1] || 'Material';
    args.chart.theme = <ChartTheme>(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)).replace(/-dark/i, "Dark").replace(/contrast/i, 'Contrast');
  }

  public pointRender(args: IPointRenderEventArgs): void {
    const colors = ['#ff6384', '#36a2eb', '#cc65fe'];
    args.fill = colors[args.point.index % colors.length];
  }

  constructor() {}
}
