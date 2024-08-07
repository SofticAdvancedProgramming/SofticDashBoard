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
  selectedPositionData: any = {}; // Store selected position data
  employees: employee[] = []; // Store employees data
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
    const companyId = localStorage.getItem('companyId'); // Get company ID from local storage
    this.employeeService.loadEmployees({ companyId }).subscribe({
      next: (response) => {
        console.log("Raw employees response:", response); // Log raw response
        this.employees = response.data.list; // Extract the list of employees
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
}
