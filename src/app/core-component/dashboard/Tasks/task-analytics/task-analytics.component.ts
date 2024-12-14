import { Component } from '@angular/core';
import { LineChartComponent } from '../../components/line-chart/line-chart.component';

@Component({
  selector: 'app-task-analytics',
  standalone: true,
  imports: [LineChartComponent],
  templateUrl: './task-analytics.component.html',
  styleUrl: './task-analytics.component.css'
})
export class TaskAnalyticsComponent {

}
