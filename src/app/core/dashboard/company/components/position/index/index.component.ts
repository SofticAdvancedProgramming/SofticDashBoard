import { Component, OnInit, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PositionService } from '../../../../../../services/positionService/position.service';
import { EmployeeService } from '../../../../../../services/employeeService/employee.service';
import { AssignEmployeesComponent } from '../../../../employee/assign-employees/assign-employees.component';
import { AddPositionComponent } from '../add-position/add-position.component';
import { employee } from '../../../../../../../models/employee';
 
@Component({
  selector: 'app-index',
  standalone: true,
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  providers: [PositionService, EmployeeService],
  imports: [RouterLink, CommonModule, AssignEmployeesComponent, AddPositionComponent]
})
export class IndexComponent implements OnInit {
  isAdd: boolean = false;
  isAddEmployee: boolean = false;  
  selectedPositionId?: string; 
  selectedPositionData: any = {};  
  employees: employee[] = [];  
  @Input() companyId?: string = '';
  positions: any[] = [];

  constructor(private positionService: PositionService, private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadPositions();
    this.loadEmployees();
  }

  loadPositions(): void {
    this.positionService.getPosition({ companyId: this.companyId }).subscribe({
      next: (response) => {
        this.positions = response.data.list;
        console.log("Positions loaded:", response);
      },
      error: (err) => {
        console.error('Error loading positions', err);
      }
    });
  }

  loadEmployees(): void {
    const companyId = localStorage.getItem('companyId');  
    this.employeeService.loadEmployees({ companyId }).subscribe({
      next: (response) => {
        console.log("Raw employees response:", response);  
        this.employees = response.data.list;  
        console.log("Employees loaded:", this.employees);
      },
      error: (err) => {
        console.error('Error loading employees', err);
      }
    });
  }

  addPosition(): void {
    this.isAdd = true;
  }

  addEmployee(positionId: string): void {
    this.selectedPositionId = positionId;
    this.selectedPositionData = this.positions.find(position => position.id === positionId);
    this.isAddEmployee = true;
  }

  handleAction(isAdd: boolean): void {
    this.isAdd = isAdd;
    console.log('Action emitted:', isAdd);
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
        console.log('Employee assigned successfully:', response);
        this.closePopup(); 
      },
      error: (err) => {
        console.error('Error assigning employee:', err);
      }
    });
  }
}
