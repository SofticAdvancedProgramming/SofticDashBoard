import { Component, Input, OnInit, ElementRef, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {
  @Input() data: any;
  @Input() options: any;
  @Input() height: string = '300px';
  isBrowser: boolean;

  constructor(private el: ElementRef, private renderer: Renderer2, @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    const chartContainer = this.el.nativeElement.querySelector('.custom-chart');
    this.renderer.setStyle(chartContainer, 'height', this.height);

    if (this.isBrowser && !this.data) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');

      this.data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
          {
            label: 'This Year',
            data: [0, 10, 5, 2, 20, 30, 45],
            fill: false,
            borderColor: '#000000',
            tension: 0.4,
            borderWidth: 2,
            pointStyle: 'circle'
          },
          {
            label: 'Last Year',
            data: [0, 5, 15, 10, 25, 20, 35],
            fill: false,
            borderColor: '#D3D3D3',
            borderDash: [5, 5],
            tension: 0.4,
            borderWidth: 2,
            pointStyle: 'circle'
          }
        ]
      };

      this.options = {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: {
              color: textColor,
              usePointStyle: true,
              pointStyle: 'circle',
              font: {
                size: 14,
                weight: 'bold'
              }
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
              font: {
                size: 12
              }
            },
            grid: {
              display: false,
              drawBorder: false
            }
          },
          y: {
            ticks: {
              color: textColorSecondary,
              font: {
                size: 12
              }
            },
            grid: {
              display: false,
              drawBorder: false
            }
          }
        }
      };
    }
  }
}
