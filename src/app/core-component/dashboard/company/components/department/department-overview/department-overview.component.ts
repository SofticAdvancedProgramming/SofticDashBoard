import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Company } from '../../../../../../../models/company';
import { Department } from '../../../../../../../models/department';
import { employee } from '../../../../../../../models/employee';
import { CompanyService } from '../../../../../../services/comapnyService/company.service';
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
export class DepartmentOverviewComponent implements OnInit, OnChanges {
  @Input() Department: Department = {} as Department;
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
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['Department'] && this.Department && this.Department.id) {
      console.log('Department input has changed:', this.Department);
      this.loadEmployeesForDepartment(this.Department.id);
    } else {
      console.warn('Department ID is missing or undefined');
    }
  }


  async getCompanyDetails(companyId: string): Promise<void> {
    try {
      console.log('Fetching company details for companyId:', companyId);
      const response = await this.companyService.getCompany({ id: companyId }).toPromise();
      if (response && response.data && response.data.list && response.data.list.length > 0) {
        this.company = response.data.list[0];
        console.log('Company details loaded:', this.company);
      } else {
        console.error('Unexpected response structure:', response);
      }
    } catch (error) {
      console.error('Error fetching company details:', error);
    }
  }

  loadEmployeesForDepartment(departmentId: number): void {
    console.log('Loading employees for departmentId:', departmentId);
    this.employeeService.loadEmployees({ departmentId: departmentId }).subscribe({
      next: (response) => {
        console.log('Employee response:', response);
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
