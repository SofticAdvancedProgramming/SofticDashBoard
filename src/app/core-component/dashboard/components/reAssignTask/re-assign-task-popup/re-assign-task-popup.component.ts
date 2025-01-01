import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EmployeeService } from '../../../../../services/employeeService/employee.service';
import { TasksService } from '../../../../../services/TasksService/tasks.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { employee } from '../../../../../../models/employee';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropDownComponent } from '../../drop-down/drop-down.component';

@Component({
  selector: 'app-re-assign-task-popup',
  standalone: true,
  imports: [FormsModule, CommonModule, DropDownComponent, ReactiveFormsModule],
  templateUrl: './re-assign-task-popup.component.html',
  styleUrl: './re-assign-task-popup.component.css',
})
export class ReAssignTaskPopupComponent {
  @Input() taskId: number = 0;
  @Output() closeAssignTask = new EventEmitter<boolean>();
  @Output() onEmployeeSelected = new EventEmitter<employee>();
  @Input() employees: employee[] = [];
  @Input() employee!: string;
  selectedEmployee: employee | null = null;
  loadingMoreEmployees = false;
  employeePage = 1;
  @Output() onChange = new EventEmitter<employee>();
  companyId!: number;
  form!: FormGroup;
  assignEmployees: any[] =[];
  constructor(
    private employeeService: EmployeeService,
    private taskService: TasksService,
    private route: ActivatedRoute,
    private toast: ToastrService,
    private fb: FormBuilder
  ) {
    this.companyId = Number(localStorage.getItem('companyId'));
  } 
  ngOnInit() {
    this.taskId = Number(this.route.snapshot.paramMap.get('id'));
    
    this.loadEmployees();
    this.initiation();
    this.getEmployeesAssignments();
  }
  initiation() {
      this.form = this.fb.group({
        isHasMainCategory: [false],
        comment: ['', Validators.required]
      });
    }
  closePopup() {
    this.closeAssignTask.emit(false);
  }
  Submit() {

    let employeesIds =[];
    for (let i = 0; i < this.assignEmployees.length; i++) {
      employeesIds.push(this.assignEmployees[i].employeeId);
    }
    


    if (this.selectedEmployee && this.taskId && this.form.controls['isHasMainCategory'].value) {
      const reAssignTaskData = {
        companyId: this.companyId,
        taskId: this.taskId,
        employeeIds: [...employeesIds, this.selectedEmployee.id],
        reason: this.form.controls['comment'].value
      };
      

      this.taskService.reAssignTask(reAssignTaskData).subscribe({
        next: (response) => {
          this.toast.success('Task assigned successfully');
          this.onEmployeeSelected.emit(this.selectedEmployee!);
          this.closePopup();
         
        },
        error(err) {
          
        },
      });
    }
    else if(!this.selectedEmployee && this.taskId && !this.form.controls['isHasMainCategory'].value){
      const reAssignTaskData = {
        companyId: this.companyId,
        taskId: this.taskId,
        employeeIds: [...employeesIds],
        reason: this.form.controls['comment'].value
      };

      this.taskService.reAssignTask(reAssignTaskData).subscribe({
        next: (response) => {
          this.toast.success('Task assigned successfully');
          this.onEmployeeSelected.emit(this.selectedEmployee!);
          this.closePopup();
          
        },
        error(err) {
          
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
      
    } else {
      
    }
  }

  getEmployeesAssignments(){
    let query = {
      companyId: this.companyId,
      taskId: this.taskId,
    }
    this.taskService.assignEmployees(query).subscribe({
      next: (res) => {
      
        this.assignEmployees = res.data.list;
        
      },
      error: (err) => {
       
      }
    })
  }
}
