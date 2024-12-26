import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModernTableComponent } from '../../components/modern-table/modern-table.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../../../../services/employeeService/employee.service';
import { employee } from '../../../../../models/employee';
import { CommonModule } from '@angular/common';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { accountStatus } from '../../../../../models/enums/accountStatus';
import { tap, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { LocalStorageService } from '../../../../services/local-storage-service/local-storage.service';

declare var bootstrap: any;

@Component({
  selector: 'app-view-employees',
  standalone: true,
  templateUrl: './view-employees.component.html',
  styleUrls: ['./view-employees.component.css'],
  imports: [
    ModernTableComponent,
    RouterLink,
    FormsModule,
    CommonModule,
    PaginationModule,
    TranslateModule,
  ],
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
  employeeToDeleteFromPositon: employee | null = null;

  constructor(
    private employeeService: EmployeeService,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService
  ) {}
  postionId!:number;

  ngOnInit() {
    //postionId
    this.route.params.subscribe(res => {
      if (res['postionId'] != undefined) {
        this.postionId = res['postionId'];
        console.log(this.postionId)
      }
    });
    this.loadEmployees();
    this.isShowingPending = false;
    this.localStorageService.setItem(
      'isPending',
      this.isShowingPending.toString()
    );
  }

  loadEmployees() {
    const status = this.isShowingPending
      ? accountStatus.Pending
      : accountStatus.Active;
    this.loadEmployeesByCompany(status);
    console.log(status)
  }

  loadEmployeesByCompany(status: accountStatus) {
    this.companyId = Number(localStorage.getItem('companyId'));
    let query;
    query={
      companyId: this.companyId,
      pageSize: this.itemsPerPage,
      pageIndex: this.currentPage,
      accountStatus: status!=0?status:'',}
      if(this.postionId!=undefined){
        query={
          ...query,
          positionId:this.postionId
        }
      }
      console.log(query)
    if (this.companyId) {
      this.employeeService
        .loadEmployees(query
        //   {
        //   companyId: this.companyId,
        //   pageSize: this.itemsPerPage,
        //   pageIndex: this.currentPage,
        //   accountStatus: status!=0?status:'',

        // }
      )
        .pipe(
          tap((response: any) => {
            console.log(response.data.list);
            this.employees = response.data.list;
            this.filteredEmployees = [...this.employees];
            this.totalRows = response.data.totalRows;
            this.applyFilter();
            this.cdr.detectChanges();
          })
        )
        .subscribe();
    } else {
      console.warn('No company found in local storage');
    }
  }

  onOptionSelected(event:Event)
  {
    const selectedValue = (event.target as HTMLSelectElement).value;

      this.loadEmployeesByCompany(+selectedValue);


  }

  toggleEmployeeStatus() {
    this.isShowingPending = !this.isShowingPending;
    this.localStorageService.setItem(
      'isPending',
      this.isShowingPending.toString()
    );
    console.log(localStorage.getItem('isPending'));

    // localStorage.setItem('isPending', this.isShowingPending.toString());
    this.currentPage = 1;
    this.loadEmployees();
  }

  applyFilter() {
    if (this.searchText.trim()) {
      this.filteredEmployees = this.employees.filter(
        (employee) =>
          employee.fullName
            .toLowerCase()
            .includes(this.searchText.toLowerCase()) ||
          employee.id.toString().includes(this.searchText) ||
          employee.department?.name
            ?.toLowerCase()
            .includes(this.searchText.toLowerCase()) ||
          '' ||
          employee.position?.name
            ?.toLowerCase()
            .includes(this.searchText.toLowerCase()) ||
          ''
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
  openDeactiveModal(employee: employee) {
    this.employeeToDelete = employee;
    const modalElement = document.getElementById('deactiveConfirmationModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }
  openDeleteEmployeeFromPositionModal(employee: employee) {
    this.employeeToDeleteFromPositon = employee;
    const modalElement = document.getElementById('deleteEmployeeFromPositionConfirmationModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  confirmDelete() {
    if (this.employeeToDelete && this.companyId) {
      this.employeeService
        .deleteEmployee(this.companyId, this.employeeToDelete.id)
        .pipe(
          tap(() => {
            console.log(
              `Employee ${this.employeeToDelete?.id} deleted successfully.`
            );
            this.loadEmployees();
            this.employeeToDelete = null;
          })
        )
        .subscribe();
    }
  }
  confirmDeactive() {
    if (this.employeeToDelete && this.companyId) {
      this.employeeService
        .deactiveEmployee(this.companyId, this.employeeToDelete.id)
        .pipe(
          tap(() => {
            console.log(
              `Employee ${this.employeeToDelete?.id} deactivated successfully.`
            );
            this.loadEmployees();
            this.employeeToDelete = null;
          })
        )
        .subscribe();
    }
  }


  confirmDeleteEmployeeFromPositon() {
    if (this.employeeToDeleteFromPositon && this.companyId && this.postionId) {
      this.employeeService
        .assginEmployeeToPosition({employeeId:this.employeeToDeleteFromPositon.id,positionId:0})
        .subscribe({
          next:(res)=>{
            console.log(res);
            this.loadEmployees();},
            error:(res)=>{
              console.log(res);}
        });
    }
  }

  onImageError(event: any) {
    event.target.src = '../../../../../assets/images/defaultImg.svg';
  }

  viewDetails(employee: employee) {
    this.router.navigate(['dashboard/employee-details', employee.id]);
  }

  getEmployeeStatusLabel() {
    return this.isShowingPending
      ? 'viewEmployees.NEW_EMPLOYEE_REQUESTS'
      : 'viewEmployees.CURRENT_EMPLOYEES';
  }
  getEmployeeStatusLabelButton() {
    return this.isShowingPending
      ? 'viewEmployees.CURRENT_EMPLOYEES'
      : 'viewEmployees.NEW_EMPLOYEE_REQUESTS';
  }
  viewLocations(employee: employee) {
    this.router.navigate(['dashboard/employee-locations', employee.id]);
  }
  getJoinDate(id:number){

  }
}
