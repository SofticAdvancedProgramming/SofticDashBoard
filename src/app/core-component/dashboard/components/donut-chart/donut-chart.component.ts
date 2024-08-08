import { Component, Inject, Input, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'donut-chart',
  templateUrl: './donut-chart.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [ChartModule, CommonModule]
})
export class DonutChartComponent implements OnInit {
  @Input() data: any;
  @Input() options: any;
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser && typeof getComputedStyle !== 'undefined') {
      if (!this.options) {
        this.options = {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '60%',
          plugins: {
            legend: {
              display: false
            }
          }
        };
      }
    }
  }

  getLegendItems() {
    if (this.data && this.data.labels && this.data.datasets) {
      const labels = this.data.labels;
      const dataset = this.data.datasets[0];
      return labels.map((label: string, index: number) => {
        return {
          label,
          color: dataset.backgroundColor[index],
          value: dataset.data[index]
        };
      });
    }
    return [];
  }

  isAllDataZero() {
    if (this.data && this.data.datasets) {
      return this.data.datasets[0].data.every((value: number) => value === 0);
    }
    return false;
  }

  getModifiedData() {
    if (this.isAllDataZero()) {
      return {
        labels: ['No Data'],
        datasets: [
          {
            data: [100],
            backgroundColor: ['#E0E0E0'],
            hoverBackgroundColor: ['#E0E0E0']
          }
        ]
      };
    }
    return this.data;
  }
}
