import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BasicTableComponent } from '../../../../components/basic-table/basic-table.component';
import { Department } from '../../../../../../../models/department';
import { employee } from '../../../../../../../models/employee';
import { AddDepartmentComponent } from '../add-department/add-department.component';
import { environment } from '../../../../../../environment/environment';
import { DepartmentOverviewComponent } from '../department-overview/department-overview.component';
import { DepartmentService } from '../../../../../../services/lockupsServices/DepartmentService/department.service';
import { EmployeeService } from '../../../../../../services/employeeService/employee.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AssignEntityComponent } from '../assign-entity/assign-entity.component';
import { ApiCall } from '../../../../../../core/services/http-service/HttpService';
import { ViewEmployeesComponent } from "../../../../employee/view-employees/view-employees.component";
import { PaginationModule } from 'ngx-bootstrap/pagination';
@Component({
    selector: 'app-departments',
    standalone: true,
    templateUrl: './departments.component.html',
    styleUrls: ['./departments.component.css'],
    providers: [DepartmentService, EmployeeService, MessageService],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        BasicTableComponent,
        RouterOutlet,
        AddDepartmentComponent,
        DepartmentOverviewComponent,
        ToastModule,
        AssignEntityComponent,
        ViewEmployeesComponent,
        PaginationModule
    ]
})
export class DepartmentsComponent implements OnInit {
  @Input() companyId?: number;
  @Output() departmentAdded = new EventEmitter<void>();
  showOverView: boolean = false;
  selectedCard: any = null;
  isAdd: boolean = false;
  isViewEmployees: boolean = false;
  isAssignEntity: boolean = false;
  private apiUrl = `${environment.apiBaseUrl}Company`;
  departments: any[] = [];
  headers: string[] = ['id', 'name', 'shortName', 'manager'];
  data: Department[] = [];
  employees: employee[] = [];
  title = 'Departments Overview';
  selectedEntityId: string | undefined = undefined;
  entityType: string = 'Employee';
  selectedDepartment: Department | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  constructor(
    private apiCall: ApiCall,
    private departmentService: DepartmentService,
    private employeeService: EmployeeService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(page: number = this.currentPage): void {
    const companyId = this.getCompanyId();
    if (companyId) {
      this.departmentService.getDepartment({ companyId, pageIndex: page, pageSize: this.itemsPerPage }).subscribe({
        next: (response) => {
          const departments: Department[] = response.data.list;
          this.totalItems = response.data.totalRows;
          this.departments = departments.map((department: Department) => ({
            id: department.id,
            title: department.name,
            department: department.shortName,
            isActive: department.isActive
          }));
          this.loadEmployees();
        }
      });
    }
  }

  handlePageChange(event: { page: number }): void {
    this.currentPage = event.page;
    this.loadDepartments(this.currentPage);
  }

  loadEmployees(): void {
    const companyId = this.getCompanyId();
    if (companyId) {
      this.employeeService.loadEmployees({ companyId }).subscribe({
        next: (response) => {
          this.employees = response.data.list.filter(
            (employee: any) => !employee.departmentId
          );
          console.log('Filtered Employees:', this.employees);
        }
      });
    }
  }


  showDetails(departmentId: number) {
    this.selectedCard = this.departments.find(dep => dep.id === departmentId);
    if (this.selectedCard) {
      this.selectedDepartment = this.selectedCard;
      console.log('Selected Department:', this.selectedDepartment);
      this.fetchData(departmentId);
      this.showOverView = true;
    } else {
      console.error('No department found with the provided cardId:', departmentId);
    }
  }

  fetchData(departmentId: number) {
    const useDemoData = true;

    if (useDemoData) {
      console.log(`Fetched mock data for card ${departmentId}:`, this.data);
    } else {
      this.apiCall.request('POST', this.apiUrl + '/Get', {}).subscribe(data => {
        console.log(data);
      });
    }
  }

  goBack() {
    if (this.showOverView) {
      this.showOverView = false;
    } else if (this.isAdd) {
      this.isAdd = false;
    } else if (this.isAssignEntity) {
      this.isAssignEntity = false;
    }
  }

  addDepartment(): void {
    this.isAdd = true;

  }
  viewEmployees(): void {
    this.isViewEmployees = true;
  }

  handleAction(isAdd: boolean): void {

    this.loadDepartments();
    this.loadEmployees();
    this.isAdd = isAdd;
  }
  handleViewEmployee(isAdd: boolean): void {
    this.isViewEmployees = this.isViewEmployees;
   }

  handleDepartmentAdded(): void {
    this.isAdd = false;
    this.loadDepartments();

  }

  deleteDepartment(departmentId: number): void {
    const companyId = this.getCompanyId();
    if (companyId) {
      this.departmentService.deleteDepartment(departmentId, companyId).subscribe({
        next: () => {
          this.showSuccess('Department deleted successfully');
          this.loadDepartments();
        }
      });
    } else {
      this.showError('Company ID is missing');
    }
  }

  assignEntity(departmentId: string): void {
    this.selectedEntityId = departmentId;
    this.entityType = 'Employee';
    this.isAssignEntity = true;
    this.selectedDepartment = this.departments.find(dep => dep.id === departmentId);
  }

  handleEntityAssigned(event: { entityId: number; relatedEntityId: number }): void {
    const requestPayload = {
      employeeId: event.entityId,
      departmentId: event.relatedEntityId
    };
    this.employeeService.assginEmployeeToDepartment(requestPayload).subscribe({
      next: (response) => {
        this.showSuccess('Employee assigned to department successfully');
        this.isAssignEntity = false;
        this.loadDepartments();
      }
    });
  }

  private getCompanyId(): number | null {
    const storedCompanyId = localStorage.getItem('companyId');
    return storedCompanyId ? Number(storedCompanyId) : null;
  }

  private showSuccess(detail: string): void {
    this.messageService.add({ severity: 'success', summary: 'Success', detail });
  }

  private showError(detail: string): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail });
  }

  toggleActivation(department: Department): void {
    if (department.isActive) {
      this.deactivatedepartment(department);
    } else {
      this.activatedepartment(department);
    }
  }

  activatedepartment(department: Department): void {
    const companyId = this.getCompanyId();
    this.departmentService.Activatedepartment(department.id,companyId||0).subscribe({
      next: () => {
        department.isActive = true;
        this.showSuccess('department activated successfully');
      }
    });
  }

  deactivatedepartment(department: Department): void {
    const companyId = this.getCompanyId();
    this.departmentService.DeActivatedepartment(department.id,companyId||0).subscribe({
      next: () => {
        department.isActive = false;
        this.showSuccess('department deactivated successfully');
      }
    });
  }
}
