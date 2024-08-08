import { Component, Inject, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActiveCompaniesComponent } from '../components/cards/active-companies/active-companies.component';
import { UncompletedCompaniesComponent } from '../components/cards/uncompleted-companies/uncompleted-companies.component';
import { NotificationsComponent } from '../components/cards/notifications/notifications.component';
import { LineChartComponent } from '../components/line-chart/line-chart.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    RouterLink,
    CommonModule,
    ActiveCompaniesComponent,
    UncompletedCompaniesComponent,
    NotificationsComponent,
    LineChartComponent
  ]
})
export class HomeComponent {
  public chartData: any;
  public chartOptions: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

      this.chartData = {
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

      this.chartOptions = {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
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
              color: 'rgba(0, 0, 0, 0.1)',
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
              color: 'rgba(0, 0, 0, 0.1)',
              drawBorder: false
            }
          }
        }
      };
    }
  }

  columns: string[] = ['Date', 'Attendance', 'Dismissal', 'Type', 'Status'];
  tableData: any[] = [
    { Date: '10/12', Attendance: '9:20 am', Dismissal: '5:20 pm', Type: 'employee', Status: 'active' },
    { Date: '10/12', Attendance: '9:25 am', Dismissal: '5:30 pm', Type: 'employee', Status: 'active' },
    { Date: '10/13', Attendance: '9:15 am', Dismissal: '5:25 pm', Type: 'employee', Status: 'active' },
    { Date: '10/14', Attendance: '9:10 am', Dismissal: '5:20 pm', Type: 'employee', Status: 'active' },
    { Date: '10/15', Attendance: '9:05 am', Dismissal: '5:35 pm', Type: 'employee', Status: 'active' },
  ];
}