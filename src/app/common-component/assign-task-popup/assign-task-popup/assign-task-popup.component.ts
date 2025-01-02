import { Component, EventEmitter, Input, Output } from '@angular/core';
import { employee } from '../../../../models/employee';
import { EmployeeService } from '../../../services/employeeService/employee.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TasksService } from '../../../services/TasksService/tasks.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropDownComponent } from '../../drop-down/drop-down.component';

@Component({
  selector: 'app-assign-task-popup',
  standalone: true,
  imports: [FormsModule, CommonModule, DropDownComponent],
  templateUrl: './assign-task-popup.component.html',
  styleUrl: './assign-task-popup.component.css',
})
export class AssignTaskPopupComponent {
  @Input() taskId: number = 0;
  @Output() closeAssignTask = new EventEmitter<boolean>();
  @Output() onEmployeeSelected = new EventEmitter<employee>();
  @Input() employees: employee[] = [];
  selectedEmployee: employee | null = null;
  loadingMoreEmployees = false;
  employeePage = 1;
  assignDate: string = '';
  @Output() onChange = new EventEmitter<employee>();
  companyId!: number;

  constructor(
    private employeeService: EmployeeService,
    private taskService: TasksService,
    private route: ActivatedRoute,
    private toast: ToastrService
  ) {
    this.companyId = Number(localStorage.getItem('companyId'));
  }
  ngOnInit() {
    this.taskId = Number(this.route.snapshot.paramMap.get('id'));

    this.loadEmployees();
  }
  closePopup() {
    this.closeAssignTask.emit(false);
  }
  Submit() {
    if (this.selectedEmployee && this.taskId) {
      const assignAssetData = {
        companyId: this.companyId,
        taskId: this.taskId,
        employeeId: this.selectedEmployee.id,
      };

      

      this.taskService.assignTask(assignAssetData).subscribe({
        next: (response) => {
          this.toast.success('Task assigned successfully');
          this.onEmployeeSelected.emit(this.selectedEmployee!);
          this.closePopup();
        
        },
        error(err) {
          console.log(err);
        },
      });
    }
  }

  loadEmployees() {
    if (this.loadingMoreEmployees) return;
    this.loadingMoreEmployees = true;

    this.employeeService
      .loadEmployees({
        accountStatus: 1,
        pageIndex: this.employeePage,
        pageSize: 10,
      })
      .subscribe({
        next: (response) => {
          const newItems = response.data.list
            .filter((item: any) => !this.employees.some((a) => a.id == item.id))
            .map((employee: any) => ({
              ...employee,
              name: `${employee.firstName} ${employee.lastName}`,
            }));

          this.employees = [...this.employees, ...newItems];
          this.employeePage++;
          this.loadingMoreEmployees = false;
        },
        error: (err) => {
          console.error('Error loading employees:', err);
          this.loadingMoreEmployees = false;
        },
      });
  }

  onEmployeeSelect(employeeId: number) {
    const employee = this.employees.find((emp) => emp.id === employeeId);

    if (employee) {

      this.selectedEmployee = employee;

    } 
  }
}
