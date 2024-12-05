import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { employee } from '../../../models/employee';
import { EmployeeService } from '../../services/employeeService/employee.service';

@Component({
  selector: 'app-assign-asset-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assign-asset-popup.component.html',
  styleUrls: ['./assign-asset-popup.component.css']
})
export class AssignAssetPopupComponent {
  @Output() closeAssignAssets = new EventEmitter<boolean>();
   @Output() onEmployeeSelected = new EventEmitter<employee>();
  @Input() employees: employee[] = [];
  selectedEmployee: employee | null = null;

  constructor(private employeeService: EmployeeService) {}

  closePopup() {
    this.closeAssignAssets.emit(false);   
  }
 

 
  Submit() {
    if (this.selectedEmployee) {
      console.log('Assign an asset to employee applied:', this.selectedEmployee);
      this.onEmployeeSelected.emit(this.selectedEmployee); 
    }
    this.closePopup();  
  }

  loadEmployees() {
    this.employeeService.getEmployees().subscribe({
      next: (res) => {
        this.employees = res.data; // assuming res.data contains the employee list
      },
      error: (err) => {
        console.error('Error loading employees:', err);
      }
    });
  }

  onEmployeeSelect(employee: employee) {
    this.selectedEmployee = employee;
  }
}
