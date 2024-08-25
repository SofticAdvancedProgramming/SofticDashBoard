import { Component, Inject, OnInit } from '@angular/core';
import { ModernTableComponent } from "../../components/modern-table/modern-table.component";
import { RouterLink } from '@angular/router';
import { EmployeeService } from '../../../../services/employeeService/employee.service';
import { employee } from '../../../../../models/employee';

@Component({
  selector: 'app-view-employees',
  standalone: true,
  templateUrl: './view-employees.component.html',
  styleUrls: ['./view-employees.component.css'],
  imports: [ModernTableComponent, RouterLink]
})
export class ViewEmployeesComponent implements OnInit {
  employeeService = Inject(EmployeeService);
  companyId:Number=0;
  employees:employee[]=[];
  ngOnInit() {
    this.loadEmployeesByCompany();
  }

  loadEmployeesByCompany() {
    this.companyId = Number(localStorage.getItem('companyId'));
    if (this.companyId) {
      this.employeeService.loadEmployees({comapnyId:this.companyId}).subscribe(
        (response: any) => {
          this.employees = response;
          console.log('Employees loaded:', this.employees);
        },
        (error: any) => {
          console.error('Error loading employees', error);
        }
      );
    } else {
      console.warn('No company found in local storage');
    }
  }
}
