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

@Component({
  selector: 'app-index',
  standalone: true,
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  providers: [PositionService, EmployeeService, MessageService],
  imports: [RouterLink, CommonModule, AssignEmployeesComponent, AddPositionComponent, ToastModule]
})
export class IndexComponent implements OnInit {
  isAdd: boolean = false;
  isAddEmployee: boolean = false;
  selectedPositionId?: string;
  directManger?:employee={} as employee
  selectedPositionData: any = {};
  slectedDepartment?: Department = {};
  employees: employee[] = [];
  @Input() companyId?: string = '';
  positions: any[] = [];
  departments: Department[] = [];
  department?: Department = {};
  constructor(
    private positionService: PositionService,
    private employeeService: EmployeeService,
    private messageService: MessageService,
    private departmentService: DepartmentService,
  ) { }

  ngOnInit(): void {
    this.loadPositions();
    this.loadEmployees();
    this.loadDepartments();
  }

  loadPositions(): void {
    this.positionService.getPosition({ companyId: this.companyId }).subscribe({
      next: (response) => {
        this.positions = response.data.list;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error loading positions' });
      }
    });
  }

  loadEmployees(): void {
    this.employeeService.loadEmployees({ companyId: this.companyId }).subscribe({
      next: (response) => {
        this.employees = response.data.list.filter(
          (employee: any) => !employee.positionId
        );
        console.log("Unassigned Employees:", this.employees);
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error loading employees' });
      }
    });
  }

  loadDepartments(): void {
    if (this.companyId) {
      this.departmentService.getDepartment({ companyId:this.companyId }).subscribe({
        next: (response) => {
           this.departments = response.data.list;
        },
        error: (err) => {
          console.error('Error loading departments', err);
        }
      });
    }
  }
  addPosition(): void {
    this.isAdd = true;
  }

  addEmployee(positionId: string): void {
    this.selectedPositionId = positionId;
    this.selectedPositionData = this.positions.find(position => position.id === positionId);
    this.department = this.departments.find(x => x.id === this.selectedPositionData?.departmentId);
    this.directManger = undefined;

    if (this.selectedPositionData?.positionManagerId) {
      this.directManger = this.employees.find(x => x.positionId === this.selectedPositionData.positionManagerId);
    }
    this.isAddEmployee = true;
}



  handleAction(isAdd: boolean): void {
    this.isAdd = isAdd;
    this.loadPositions();
    this.loadEmployees();
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
        this.loadEmployees();
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
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error deleting position' });
      }
    });
  }
}
