import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Company } from '../../../../../../../models/company';
import { Department } from '../../../../../../../models/department';
import { employee } from '../../../../../../../models/employee';
import { CompanyService } from '../../../../../../services/comapnyService/company.service';
import { DepartmentService } from '../../../../../../services/lockupsServices/DepartmentService/department.service';
import { EmployeeService } from '../../../../../../services/employeeService/employee.service';
import { CommonModule } from '@angular/common';
import { ModernTableComponent } from '../../../../components/modern-table/modern-table.component';

@Component({
  selector: 'app-department-overview',
  standalone: true,
  templateUrl: './department-overview.component.html',
  styleUrls: ['./department-overview.component.css'],
  imports: [CommonModule, ModernTableComponent]
})
export class DepartmentOverviewComponent implements OnInit {
  @Input() Department: Department = {} as Department;  // Ensure this is provided
  @Output() departmentAdded = new EventEmitter<void>();
  companyId: string = '';
  company: Company = {} as Company;
  employees: employee[] = [];
  showEmployees: boolean = false;
  showAddSubDepartmentForm: boolean = false;

  constructor(
    private companyService: CompanyService,
    private employeeService: EmployeeService
  ) {}

   ngOnInit() {
    this.companyId = localStorage.getItem('companyId') || '';

    if (this.companyId) {
       this.getCompanyDetails(this.companyId);
    }

    // Load employees directly from the Department object's ID
    if (this.Department?.id) {
      this.loadEmployeesForDepartment(this.Department.id);
    } else {
      console.error('Department ID is missing');
    }
  }

  async getCompanyDetails(companyId: string): Promise<void> {
    try {
      const response = await this.companyService.getCompany({ id: companyId }).toPromise();
      if (response && response.data && response.data.list && response.data.list.length > 0) {
        this.company = response.data.list[0];
        console.log("this.company:", this.company);
      } else {
        console.error('Unexpected response structure:', response);
      }
    } catch (error) {
      console.error('Error fetching company details:', error);
    }
  }

  loadEmployeesForDepartment(departmentId: number): void {
    this.employeeService.loadEmployees({ departmentId: departmentId }).subscribe({
      next: (response) => {
        if (response && response.data && response.data.list) {
          this.employees = response.data.list;
          console.log('Employees loaded:', this.employees);
        } else {
          console.error('Unexpected response structure when loading employees:', response);
        }
      },
      error: (err) => {
        console.error('Error loading employees', err);
      }
    });
  }

  toggleEmployeesVisibility(): void {
    this.showEmployees = !this.showEmployees;
  }

  toggleAddSubDepartment(): void {
    this.showAddSubDepartmentForm = !this.showAddSubDepartmentForm;
  }

  goBack() {
    this.departmentAdded.emit();
  }
}
