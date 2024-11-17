import { CommonModule } from '@angular/common';
import { Component ,Input  } from '@angular/core';

@Component({
  selector: 'app-dashboard-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-card.component.html',
  styleUrl: './dashboard-card.component.css'
})
export class DashboardCardComponent {
  language: string = localStorage.getItem('lang') || 'ar'
  @Input() title: string = '';
  @Input() value: number = 0;
  @Input() percentage: string = '0%';
  @Input() cardClass: string = 'lightCard';
  @Input() bgColor: string = '#FFFFFF';
  @Input() icon: string = '';
}
