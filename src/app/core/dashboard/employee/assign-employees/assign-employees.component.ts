import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-assign-employees',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assign-employees.component.html',
  styleUrl: './assign-employees.component.css'
})
export class AssignEmployeesComponent {
  @Input() positionId?: string;
  @Output() close = new EventEmitter<void>();
}
