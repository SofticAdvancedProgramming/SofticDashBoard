import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModernTableComponent } from "../../components/modern-table/modern-table.component";
import { Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../../../../services/employeeService/employee.service';
import { employee } from '../../../../../models/employee';
import { CommonModule } from '@angular/common';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { accountStatus } from '../../../../../models/enums/accountStatus';
import { tap, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

declare var bootstrap: any;

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
  isShowingPending: boolean = false;
  employeeToDelete: employee | null = null;

  constructor(private employeeService: EmployeeService, private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    const status = this.isShowingPending ? accountStatus.Pending : accountStatus.Active;
    this.loadEmployeesByCompany(status);
  }

  loadEmployeesByCompany(status: accountStatus) {
    this.companyId = Number(localStorage.getItem('companyId'));
    if (this.companyId) {
      this.employeeService.loadEmployees({
        companyId: this.companyId,
        pageSize: this.itemsPerPage,
        pageIndex: this.currentPage,
        accountStatus: status
      }).pipe(
        tap((response: any) => {
          this.employees = response.data.list;
          this.filteredEmployees = [...this.employees];
          this.totalRows = response.data.totalRows;
          this.applyFilter();
          this.cdr.detectChanges();
        }),
        catchError((error: any) => {
          console.error('Error loading employees', error);
          return of([]);
        })
      ).subscribe();
    } else {
      console.warn('No company found in local storage');
    }
  }

  toggleEmployeeStatus() {
    this.isShowingPending = !this.isShowingPending;
    this.currentPage = 1;
    this.loadEmployees();}


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
  }

  handlePageChange(event: { page: number }) {
    this.currentPage = event.page;
    this.loadEmployees();
  }

  openDeleteModal(employee: employee) {
    this.employeeToDelete = employee;
    const modalElement = document.getElementById('deleteConfirmationModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  confirmDelete() {
    if (this.employeeToDelete && this.companyId) {
      this.employeeService.deleteEmployee(this.companyId, this.employeeToDelete.id)
        .pipe(
          tap(() => {
            console.log(`Employee ${this.employeeToDelete?.id} deleted successfully.`);
            this.loadEmployees();
            this.employeeToDelete = null;
          }),
          catchError((error) => {
            console.error('Error deleting employee', error);
            return of([]);
          })
        )
        .subscribe();
    }
  }

  onImageError(event: any) {
    event.target.src = '../../../../../assets/images/defaultImg.svg';
  }

  viewDetails(employee: employee) {
    this.router.navigate(['dashboard/employee-details', employee.id]);
  }
}
