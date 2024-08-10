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

@Component({
  selector: 'app-departments',
  standalone: true,
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    BasicTableComponent,
    RouterOutlet,
    AddDepartmentComponent,
    DepartmentOverviewComponent,
    ToastModule,
    AssignEntityComponent
  ],
  providers: [DepartmentService, EmployeeService, MessageService]
})
export class DepartmentsComponent implements OnInit {
  @Input() companyId?: number;
  @Output() departmentAdded = new EventEmitter<void>();
  showOverView: boolean = false;
  selectedCard: any = null;
  isAdd: boolean = false;
  isAssignEntity: boolean = false;
  private apiUrl = `${environment.apiBaseUrl}Company`;
  department: Department = {} as Department;
  cards: any[] = [];
  headers: string[] = ['id', 'name', 'shortName', 'manager'];
  data: Department[] = [];
  employees: employee[] = [];
  title = 'Departments Overview';
  selectedEntityId: string | undefined = undefined;
  entityType: string = 'Employee';
  selectedDepartment: Department | null = null;

  constructor(
    private apiCall: ApiCall,
    private router: Router,
    private departmentService: DepartmentService,
    private employeeService: EmployeeService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    const companyId = this.getCompanyId();
    if (companyId) {
      this.departmentService.getDepartment({ companyId }).subscribe({
        next: (response) => {
          const departments: Department[] = response.data.list;
          this.cards = departments.map((department: Department) => ({
            id: department.id,
            title: department.name,
            department: department.shortName
          }));
          this.loadEmployees();
        },
        error: (err) => {
          console.error('Error loading departments', err);
          this.showError('Error loading departments');
        }
      });
    }
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
        },
        error: (err) => {
          console.error('Error loading employees', err);
          this.showError('Error loading employees');
        }
      });
    }
  }

  showDetails(cardId: number) {
    this.selectedCard = this.cards.find(card => card.id === cardId);
    this.fetchData(cardId);
    this.showOverView = true;
  }

  fetchData(cardId: number) {
    const useDemoData = true;

    if (useDemoData) {
      console.log(`Fetched mock data for card ${cardId}:`, this.data);
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

  handleAction(isAdd: boolean): void {
    this.isAdd = isAdd;
    console.log('Action emitted:', isAdd);
  }

  handleDepartmentAdded(): void {
    this.loadDepartments();
    this.isAdd = false;
  }

  deleteDepartment(departmentId: number): void {
    const companyId = this.getCompanyId();
    if (companyId) {
      this.departmentService.deleteDepartment(departmentId, companyId).subscribe({
        next: () => {
          this.showSuccess('Department deleted successfully');
          this.loadDepartments();
        },
        error: (err) => {
          console.error('Error deleting department', err);
          this.showError('Error deleting department');
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
    this.selectedDepartment = this.cards.find(card => card.id === departmentId);
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
      },
      error: (err) => {
        console.error('Error assigning employee to department', err);
        this.showError('Error assigning employee to department');
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
}
