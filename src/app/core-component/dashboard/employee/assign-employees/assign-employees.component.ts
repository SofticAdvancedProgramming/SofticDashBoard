import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { employee } from '../../../../../models/employee';

@Component({
  selector: 'app-assign-employees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assign-employees.component.html',
  styleUrls: ['./assign-employees.component.css']
})
export class AssignEmployeesComponent {
  @Input() positionId?: string;
  @Input() Position: string = 'Position';
  @Input() PositionDescription: string = '';
  @Input() Department: string = 'Department';
  @Input() DepartmentDescription: string = '';
  @Input() DirectManager: string = 'Direct Manager';
  @Input() DirectManagerDescription: string = '';
  @Input() employees: employee[] = [];
  @Input() popupContent: any;
  @Output() close = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<{ employeeId: number, positionId: number }>();

  selectedEmployeeId: string = '';

  onSubmit() {
    if (this.selectedEmployeeId && this.positionId) {
      this.submitForm.emit({
        employeeId: Number(this.selectedEmployeeId),
        positionId: Number(this.positionId)
      });
    }
  }
}
