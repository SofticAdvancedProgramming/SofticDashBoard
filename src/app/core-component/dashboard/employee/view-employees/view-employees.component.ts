import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModernTableComponent } from "../../components/modern-table/modern-table.component";
import { RouterLink } from '@angular/router';
import { EmployeeService } from '../../../../services/employeeService/employee.service';
import { employee } from '../../../../../models/employee';
import { CommonModule } from '@angular/common';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-employees',
  standalone: true,
  templateUrl: './view-employees.component.html',
  styleUrls: ['./view-employees.component.css'],
  imports: [ModernTableComponent, RouterLink, FormsModule, CommonModule, PaginationModule]
})
export class ViewEmployeesComponent implements OnInit {
  companyId: number = 0;
  employees: employee[] = [];
  filteredEmployees: employee[] = [];
  searchText: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalRows: number = 0;

  constructor(private employeeService: EmployeeService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadEmployeesByCompany();
  }

  loadEmployeesByCompany() {
    this.companyId = Number(localStorage.getItem('companyId'));
    if (this.companyId) {
      console.log('Loading employees for company:', this.companyId, 'Page:', this.currentPage);

      this.employeeService.loadEmployees({
        companyId: this.companyId,
        pageSize: this.itemsPerPage,
        pageIndex: this.currentPage
      }).subscribe(
        (response: any) => {
          this.employees = response.data.list;
          this.filteredEmployees = [...this.employees];
          this.totalRows = response.data.totalRows;
          console.log('Employees loaded:', this.employees);
          this.applyFilter();
          this.cdr.detectChanges();
        },
        (error: any) => {
          console.error('Error loading employees', error);
        }
      );
    } else {
      console.warn('No company found in local storage');
    }
  }

  applyFilter() {
    if (this.searchText.trim()) {
      this.filteredEmployees = this.employees.filter(employee =>
        employee.fullName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        employee.id.toString().includes(this.searchText) ||
        (employee.department?.name?.toLowerCase().includes(this.searchText.toLowerCase()) || '') ||
        (employee.position?.name?.toLowerCase().includes(this.searchText.toLowerCase()) || '')
      );
    } else {
      this.filteredEmployees = [...this.employees];
    }
    console.log('Filtered Employees:', this.filteredEmployees);
  }

  handlePageChange(event: { page: number }) {
    this.currentPage = event.page;
    console.log('Page changed to:', this.currentPage);
    this.loadEmployeesByCompany();
  }

  viewDetails(employee: employee) {
    console.log('Viewing details for', employee);
  }

  deleteEmployee(employee: employee) {
    console.log('Deleting employee', employee);
  }
  onImageError(event: any) {
    event.target.src = '../../../../../assets/images/defaultImg.svg';
  }
}
