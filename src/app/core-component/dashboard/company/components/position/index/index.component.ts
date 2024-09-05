import { FontModel } from './../../../../../../../assets/ej2-treemap/src/treemap/model/base-model.d';
import { Component, OnInit, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PositionService } from '../../../../../../services/positionService/position.service';
import { EmployeeService } from '../../../../../../services/employeeService/employee.service';
import { AssignEmployeesComponent } from '../../../../employee/assign-employees/assign-employees.component';
import { AddPositionComponent } from '../add-position/add-position.component';
import { employee } from '../../../../../../../models/employee';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Department } from '../../../../../../../models/department';
import { DepartmentService } from '../../../../../../services/lockupsServices/DepartmentService/department.service';
import { ModernTableComponent } from '../../../../components/modern-table/modern-table.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-index',
  standalone: true,
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  providers: [PositionService, EmployeeService, MessageService],
  imports: [RouterLink, CommonModule, AssignEmployeesComponent,PaginationModule, AddPositionComponent, ToastModule, ModernTableComponent,FormsModule]
})
export class IndexComponent implements OnInit {
  isAdd: boolean = false;
  isAddEmployee: boolean = false;
  showDetails: boolean = false;
  selectedPositionId?: string;
  selectedPositionData: any = {};
  directManger?: employee = {} as employee;
  employees: employee[] = [];
  @Input() companyId?: string = '';
  positions: any[] = [];
  departments: Department[] = [];
  currentPage: number = 1;  
  itemsPerPage: number = 10;  
  totalItems: number = 0;
  constructor(
    private positionService: PositionService,
    private employeeService: EmployeeService,
    private messageService: MessageService,
    private departmentService: DepartmentService,
  ) { }

  ngOnInit(): void {
    this.loadPositions();
    this.loadDepartments();
  }
  loadPositions(page: number = this.currentPage): void {
    this.positionService.getPosition({ companyId: this.companyId, pageSize: this.itemsPerPage, pageIndex: page }).subscribe({
      next: (response) => {
        this.positions = response.data.list;
        this.totalItems = response.data.totalRows;  
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error loading positions' });
      }
    });
  }

  loadUnassignedEmployees(): void {
    this.employeeService.loadEmployees({ companyId: this.companyId }).subscribe({
      next: (response) => {
        this.employees = response.data.list.filter(
          (employee: any) => !employee.positionId
        );
        console.log("Unassigned Employees:", this.employees);
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error loading unassigned employees' });
      }
    });
  }
  handlePageChange(event: { page: number }): void {
    this.currentPage = event.page;
    this.loadPositions(this.currentPage);
  }
  loadEmployeesByPosition(positionId: string): void {
    this.employeeService.loadEmployees({ companyId: this.companyId }).subscribe({
      next: (response) => {
        this.employees = response.data.list.filter(
          (employee: any) => employee.positionId === positionId
        );
        console.log("Employees for Position:", this.employees);
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error loading employees for position' });
      }
    });
  }

  loadDepartments(): void {
    if (this.companyId) {
      this.departmentService.getDepartment({ companyId: this.companyId }).subscribe({
        next: (response) => {
          this.departments = response.data.list;
        },
        error: (err) => {
          console.error('Error loading departments', err);
        }
      });
    }
  }

  getDepartmentName(departmentId: number): string {
    const department = this.departments.find(dep => dep.id === departmentId);
    return department?.name ?? 'Unknown';
  }

  addPosition(): void {
    this.isAdd = true;
  }

  addEmployee(positionId: string): void {
    this.selectedPositionId = positionId;
    this.selectedPositionData = this.positions.find(position => position.id === positionId);
    this.loadUnassignedEmployees();
    this.isAddEmployee = true;
  }

  handleAction(isAdd: boolean): void {
    this.isAdd = isAdd;
    this.loadPositions();
  }

  closePopup(): void {
    this.isAddEmployee = false;
  }

  handleFormSubmit(formData: { employeeId: number, positionId: number }): void {
    this.employeeService.assginEmployeeToPosition({
      employeeId: formData.employeeId,
      positionId: formData.positionId
    }).subscribe({
      next: (response) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Employee assigned successfully' });
        this.closePopup();
        this.loadPositions();
        this.loadUnassignedEmployees();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error assigning employee' });
      }
    });
  }

  deletePosition(positionId: number): void {
    const companyId = this.companyId ? parseInt(this.companyId) : 0;
    this.positionService.deletePosition(positionId, companyId).subscribe({
      next: () => {
        this.positions = this.positions.filter(position => position.id !== positionId);
        this.loadPositions();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Position deleted successfully' });
      },
      error: (err) => {
       }
    });
  }

  showDetailsPage(positionId: string): void {
    this.selectedPositionId = positionId;
    this.selectedPositionData = this.positions.find(position => position.id === positionId);
    this.loadEmployeesByPosition(positionId);
    this.showDetails = true;
  }

  goBack(): void {
    this.showDetails = false;
  }
}
