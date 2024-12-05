import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { employee } from '../../../models/employee';
import { EmployeeService } from '../../services/employeeService/employee.service';
import { DropDownComponent } from "../../core-component/dashboard/components/drop-down/drop-down.component";

@Component({
    selector: 'app-assign-asset-popup',
    standalone: true,
    templateUrl: './assign-asset-popup.component.html',
    styleUrls: ['./assign-asset-popup.component.css'],
    imports: [CommonModule, DropDownComponent]
})
export class AssignAssetPopupComponent {
  @Output() closeAssignAssets = new EventEmitter<boolean>();
  @Output() onEmployeeSelected = new EventEmitter<employee>();
  @Input() employees: employee[] = [];
  selectedEmployee: employee | null = null;
  loadingMoreEmployees = false;
  employeePage = 1;

  ngOnInit() {
    this.loadEmployees();
  }
  constructor(private employeeService: EmployeeService) { }

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
    if (this.loadingMoreEmployees) return;
    this.loadingMoreEmployees = true;

    this.employeeService.loadEmployees({
      accountStatus: 1,
      pageIndex: this.employeePage,
      pageSize: 10
    }).subscribe({
      next: (response) => {
         const newItems = response.data.list.filter((item: any) => !this.employees.some(a => a.id == item.id))
          .map((employee: any) => ({
            ...employee,
            name: `${employee.firstName} ${employee.lastName}`  
          }));
        
        this.employees = [...this.employees, ...newItems];
        this.employeePage++;
        this.loadingMoreEmployees = false;
      },
      error: (err) => {
        console.error('Error loading employees:', err);
        this.loadingMoreEmployees = false;
      }
    });
  }

  onEmployeeSelect(employee: employee) {
    this.selectedEmployee = employee;
  }

}
