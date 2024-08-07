import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { employee } from '../../../../../models/employee';
 
@Component({
  selector: 'app-assign-employees',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assign-employees.component.html',
  styleUrls: ['./assign-employees.component.css']
})
export class AssignEmployeesComponent {
  @Input() positionId?: string;
  @Input() Position?: string;  
  @Input() PositionDescription?: string;  
  @Input() Department?: string;  
  @Input() DepartmentDescription?: string;  
  @Input() DirectManager?: string;  
  @Input() DirectManagerDescription?: string;  
  @Input() employees: employee[] = [];  
  @Input() popupContent: any;  
  @Output() close = new EventEmitter<void>();
}
