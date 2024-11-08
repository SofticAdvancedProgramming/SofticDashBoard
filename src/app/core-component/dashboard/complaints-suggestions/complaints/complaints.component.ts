import { Inject, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { LineChartComponent } from "../../components/line-chart/line-chart.component";
import { CommonModule, isPlatformBrowser } from '@angular/common';

enum ComplaintStatus {
  PENDING = 2,
  REJECTED = 3,
  ACCEPTED = 1,
  REVIEW = 4,
}

interface Complaint {
  id: number;
  employee: {
    firstName: string;
    lastName: string;
    jobTitle: string;
    profileImage?: string;
  };
  title: string;
  description: string;
  statusId: ComplaintStatus;
  companyId: number;
}

@Component({
  selector: 'app-complaints',
  templateUrl: './complaints.component.html',
  styleUrls: ['./complaints.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, RouterLink, LineChartComponent]
})
export class ComplaintsComponent implements OnInit {
  public chartData: any;
  public chartOptions: any;
  complaints: Complaint[] = [];
  filteredComplaints: Complaint[] = [];
  selectedStatus: ComplaintStatus = ComplaintStatus.PENDING;
  public ComplaintStatus = ComplaintStatus;

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalComplaints: number = 0;

  constructor(private translate: TranslateService, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) { }
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
    this.loadDemoComplaints();
    this.filterComplaints();
  }


  loadDemoComplaints(): void {
    this.complaints = [
      {
        id: 1,
        employee: { firstName: 'Yomna', lastName: 'Ashraf', jobTitle: 'UI/UX Designer' },
        title: 'Delay enhancement',
        description: 'Delay in implementing the enhancement',
        statusId: ComplaintStatus.PENDING,
        companyId: 1,
      },
      {
        id: 2,
        employee: { firstName: 'Yomna', lastName: 'Ashraf', jobTitle: 'UI/UX Designer' },
        title: 'Delay enhancement',
        description: 'Delay in implementing the enhancement',
        statusId: ComplaintStatus.REJECTED,
        companyId: 1,
      },
      {
        id: 3,
        employee: { firstName: 'Yomna', lastName: 'Ashraf', jobTitle: 'UI/UX Designer' },
        title: 'Delay enhancement',
        description: 'Delay in implementing the enhancement',
        statusId: ComplaintStatus.ACCEPTED,
        companyId: 1,
      },
      {
        id: 4,
        employee: { firstName: 'Yomna', lastName: 'Ashraf', jobTitle: 'UI/UX Designer' },
        title: 'Delay enhancement',
        description: 'Delay in implementing the enhancement',
        statusId: ComplaintStatus.REVIEW,
        companyId: 1,
      }
    ];
    this.totalComplaints = this.complaints.length;
  }

  filterComplaints(): void {
    this.filteredComplaints = this.complaints.filter(complaint => {
      return this.selectedStatus === ComplaintStatus.PENDING || complaint.statusId === this.selectedStatus;
    });
  }

  deleteComplaint(id: number): void {
    this.complaints = this.complaints.filter(complaint => complaint.id !== id);
    this.filterComplaints();
    console.log(`Complaint ${id} deleted successfully.`);
  }

  isArabicLanguage(): boolean {
    return localStorage.getItem('lang') === 'ar';
  }


  viewComplaintDetails(id: number): void {
    this.router.navigate(['/complain-details', id]);
  }
}
