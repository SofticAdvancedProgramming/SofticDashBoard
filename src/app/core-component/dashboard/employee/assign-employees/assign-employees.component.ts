import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { employee } from '../../../../../models/employee';
import { DropDownComponent } from "../../components/drop-down/drop-down.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../../../services/employeeService/employee.service';
import { firstValueFrom } from 'rxjs';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-assign-employees',
  standalone: true,
  templateUrl: './assign-employees.component.html',
  styleUrls: ['./assign-employees.component.css'],
  imports: [DropDownComponent, FormsModule, CommonModule, TranslateModule, RouterLink]
})
export class AssignEmployeesComponent implements OnInit {
  @Input() positionId?: string;
  @Input() Position: string = 'Position';
  @Input() PositionDescription: string = '';
  @Input() Department: string = 'Department';
  @Input() DepartmentDescription: string = '';
  @Input() DirectManager: string = 'Direct Manager';
  @Input() DirectManagerDescription: string = '';
  @Input() employee!: any[];
  isAssigned?: boolean;
  employees: employee[] = [];
  loadingMoreEmployees = false;
  employeePage = 1;
  totalEmployees: number = 10;
  @Output() close = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<{ employeeId: number, positionId: number }>();
  @Output() getNextPage = new EventEmitter<number>();
  @Output() search = new EventEmitter<string>();
  @Input() popupContent?: TemplateRef<any>;
  selectedEmployeeId: string = '';
  currentPage: number = 1;


  constructor(private employeeService: EmployeeService) {
    debugger
    let x =this.employees
    this.loadEmployees();
    x =this.employees
    console.log("hhhhhhhhhhhhhhhhhhhhh")
  }
  ngOnInit(): void {
    this.getPositionEmployee();
  }
  async getPositionEmployee(): Promise<void> {
    const response: any = await firstValueFrom(this.employeeService.getEmployees({ positionId: this.positionId }));
    if (response.data.list.length > 0) {
      this.isAssigned = true
    } else {
      this.isAssigned = false;
    }
  }



  onEmployeeSelect(employee: any) {
    this.selectedEmployeeId = employee;
    console.log(employee);

  }
  loadEmployees(): void {
    if (this.loadingMoreEmployees) return;
    this.loadingMoreEmployees = true
    this.employeeService.loadEmployees({
      accountStatus: 1,
      pageIndex: this.employeePage,
      pageSize: 1000,
    }).subscribe({
      next: (response) => {
        console.log(response)
        const newItems = response.data.list.filter((item: any) => !this.employees.some(a => a.id == item.id));
        this.employees = [...this.employees, ...newItems]

        this.employees = [...this.employees.filter((employee: any) => !employee.positionId)]
        this.employees = this.employees.map(employee => ({
          ...employee,
          name: employee.firstName + " " + employee.lastName
        }));
        this.loadingMoreEmployees = false;
        if (newItems.length) this.employeePage++;

      },
      error: (err) => this.loadingMoreEmployees = false,
    });
  }

  onSubmit() {
    if (this.selectedEmployeeId && this.positionId) {
      this.submitForm.emit({
        employeeId: Number(this.selectedEmployeeId),
        positionId: Number(this.positionId),
      });
    }
  }
}
