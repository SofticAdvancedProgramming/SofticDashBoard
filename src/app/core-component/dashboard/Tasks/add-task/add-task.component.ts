import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TasksService } from '../../../../services/TasksService/tasks.service';
import { ImageUploadService } from '../../../../services/ImageUploadService/image-upload.service';
import { DropDownComponent } from '../../components/drop-down/drop-down.component';
import { employee } from '../../../../../models/employee';
import { EmployeeService } from '../../../../services/employeeService/employee.service';
import { ToastrService } from 'ngx-toastr';
import { MatSelectModule } from '@angular/material/select';
import { ToDoItemService } from '../../../../services/ToDoItemService/to-do-item.service';
import { DeletePopUpComponent } from '../../components/delete-pop-up/delete-pop-up.component';
import { DeleteConfirmationPopUpComponent } from '../../components/delete-confirmation-pop-up/delete-confirmation-pop-up/delete-confirmation-pop-up.component';
import { MatOptionModule } from '@angular/material/core';
import { RequestTypeService } from '../../../../services/requestTypeService/request-type.service';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [
    TranslateModule,
    RouterLink,
    RouterLinkActive,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    DropDownComponent,
    MatSelectModule,
    MatOptionModule,
    DeleteConfirmationPopUpComponent,
  ],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css',
  providers: [DatePipe],
})
export class AddTaskComponent implements OnInit {
  id!: number;
  companyId!: number;
  form!: FormGroup;
  PhotoExtension: any;
  uploadedImageBase64: any;
  attachmentImagePreviewUrl: string | ArrayBuffer | null = null;
  attachmentfileType: string | null = null;
  attachmentUploadMessage: string | null = null;
  attachments: any[] = [];
  addToDo: number[] = [];
  Teams: any[] = [];

  files: {
    companyId: number;
    fileExtension: string;
    previewUrl: string;
    file?: string;
    fileName?: string;
    fileType?: string;
  }[] = [];
  employees: employee[] = [];
  priorities: any[] = [];
  selectedEmployee: any;
  loadingMoreEmployees = false;
  todayDate: string = '';
  employeePage = 1;
  taskDetails: any;
  todoItems: any;
  todoValues: any;
  selectedEmployeeIds: number[] = [];
  selectedEmployeeNames: string[] = [];
  assignedEmployees: any;
  isDelete: boolean = false;
  todoGroup!: FormGroup;
  Branches: any[] = [];
  departments: any[] = [];
  branchId: any;
  departmentId: any;
  taskAssignments: any[] = [];
  firstBind = false;
  counter = 0;
  constructor(
    private fb: FormBuilder,
    private tasksService: TasksService,
    private imageUploadService: ImageUploadService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private toast: ToastrService,
    private datePipe: DatePipe,
    private router: Router,
    private todoService: ToDoItemService,
    private requestTypeService: RequestTypeService
  ) {
    this.companyId = Number(localStorage.getItem('companyId'));
  }
  ngOnInit(): void {
    this.counter++;
    this.route.params.subscribe((params) => {
      this.id = params['id'];
      if (this.id) {
        this.getTasksDetails();
        this.getEmployeesAssignments();
        this.getTodoItems();
      }
    });
  
    this.initiation();
    this.loadEmployees();
    this.getPriorities();
    this.loadBranches();
    this.getTeams();
  
     
  }
  

  initiation() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      taskDetails: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(300)]],
      initialCost: [''],
      priority: [''],
      isGlobal: [false],
      branchId: [null],
      departmentIds: [[]],
      EmployeeIds: [[]],
      todos: this.fb.array([]),
      isTeam: [false],
      teamId: [[]],
    });

  }

  get todos(): FormArray {
    return this.form.get('todos') as FormArray;
  }
  addToDoFun() {
    this.todos.push(
      this.fb.group({
        description: ['', Validators.required],
        employeeId: [null, Validators.required],
      })
    );
  }

  getTodoItems() {
    let query = {
      taskId: this.id,
      pageSize: 1000,
    };

    this.todoService.get(query).subscribe({
      next: (res) => {
        this.todoItems = res.data.list;
        this.todoItems?.forEach((todo: any) => {
          const todoGroup1: any = this.fb.group({
            description: [todo.description, Validators.required],
            employeeId: [todo.employeeId, Validators.required],
            id: [todo.id],
          });
          this.todos.push(todoGroup1);


        });
        console.log(this.todos);

      },
      error: (err) => {

      },
    });
  }
  removeTodo(index: number): void {
    this.isDelete = false;
    this.todos.removeAt(index);
    const todoId = this.todoItems[index].id;
    this.todoService.delete(todoId, this.companyId).subscribe({
      next: (res) => {

        this.toast.success('Deleted Successfully');
        this.ngOnInit();
      },
      error(err) {

      },
    });
  }
  deleteTodo() {
    this.isDelete = true;
  }
  onCancel() {
    this.isDelete = false;
  }

  populateForm() {
    const formattedDate = this.datePipe.transform(
      this.taskDetails?.startDate,
      'yyyy-MM-dd'
    );

    this.form.patchValue({
      name: this.taskDetails?.name,
      taskDetails: this.taskDetails?.description,
      initialCost: this.taskDetails?.initialBudget,
      priority: this.taskDetails?.priorityId,
      isGlobal: this.taskDetails?.isGlobal,
      branchId: this.taskDetails?.branchId || null,
      departmentIds: this.taskDetails?.departmentIds || [],
      isTeam: this.taskDetails?.isTeam || false,
      teamId: this.taskDetails?.teamId ? [this.taskDetails.teamId] : [],
    });
  }

  onSubmit() {
    console.log("Before Submit Form Values:", this.form.value);
  
    this.todoValues = this.form.value.todos;
    const toDoItems: any[] = [];
    for (let i = 0; i < this.todoValues.length; i++) {
      toDoItems.push({
        companyId: this.companyId,
        id: this.todoValues[i].id,
        ...this.todoValues[i],
      });
    }
  
    let query: any = {
      companyId: this.companyId,
      name: this.form.controls['name'].value,
      description: this.form.controls['taskDetails'].value,
      initialBudget: this.form.controls['initialCost'].value,
      statusId: 1,
      branchId: this.form.controls['branchId'].value,
      taskAttachments: this.attachments,
      priorityId: this.form.controls['priority'].value || null,
      toDoItems: toDoItems,
      taskAssignments: [],
    };
  
    // ✅ Assign employees if any are selected
    if (this.form.value.EmployeeIds.length > 0) {
      this.taskAssignments = this.form.value.EmployeeIds.map((empId: number) => ({
        companyId: this.companyId,
        employeeId: empId,
      }));
  
      query.taskAssignments = this.taskAssignments;
    }
  
    // ✅ Handle Global Assignment
    if (this.form.value.departmentIds.length > 0) {
      query.isGlobal = false;
      query.departmentIds = this.form.value.departmentIds;
    } else {
      query.isGlobal = this.form.value.isGlobal;
      query.departmentIds = this.form.value.isGlobal ? [] : this.form.value.departmentIds;
    }
  
    // ✅ Ensure `teamId` and `isTeam` are correctly set
    if (this.form.value.isTeam) {
      if (this.form.value.teamId && this.form.value.teamId.length > 0) {
        query.isTeam = true;
        query.teamId = this.form.value.teamId[0]; // Ensure single value is assigned
      } else {
        query.isTeam = false;
        query.teamId = null;
      }
    } else {
      query.isTeam = false;
      query.teamId = null;
    }
  
    console.log("Final Query to API:", query);
  
    // ✅ Send Data to API
    if (this.id) {
      query.id = this.id;
      this.tasksService.edit(query).subscribe({
        next: () => {
          this.toast.success('Edited Successfully');
          this.ngOnInit();
        },
        error: (err) => console.error("Edit Error:", err),
      });
    } else {
      this.tasksService.add(query).subscribe({
        next: () => {
          this.toast.success('Added Successfully');
          this.ngOnInit();
          this.router.navigateByUrl('/dashboard/tasks');
        },
        error: (err) => console.error("Add Error:", err),
      });
    }
  }
  
  
  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return control
      ? control.invalid && (control.dirty || control.touched)
      : false;
  }

  onAttachmentChange(event: any): void {


    const file = event.target.files[0];
    if (file) {
      const attachmentfileType = file.type;
      const fileName = file.name;

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string | null;
        if (result) {
          const base64String = result.split(',')[1];
          const companyId = this.companyId;
          const extension = fileName.split('.').pop();
          const fileDetails: {
            companyId: number;
            fileExtension: string;
            previewUrl: string;
            file?: string;
            fileName?: string;
            fileType?: string;
          } = {
            companyId: companyId,
            fileExtension: extension,
            file: base64String,
            fileName: fileName,
            fileType: attachmentfileType,
            previewUrl: result,
          };
          const dataFile: {
            companyId: number;
            fileExtension: string;
            file: string;
            id: number;
            taskId: number;
          } = {
            companyId: companyId,
            fileExtension: extension,
            file: base64String,
            id: 0,
            taskId: 0,
          };
          this.attachments.push(dataFile);

          if (attachmentfileType.startsWith('image/')) {
            this.attachmentImagePreviewUrl = result;

          }

          this.files.push(fileDetails);


          this.attachmentUploadMessage = this.translate.instant(
            attachmentfileType.startsWith('image/')
              ? 'ASSET_UPLOADER.uploadAnotherImage'
              : 'ASSET_UPLOADER.uploadAnotherFile'
          );
        }
      };

      reader.readAsDataURL(file);
    }
  }

  getPriorities() {
    this.tasksService.getPriorities({}).subscribe({
      next: (res) => {

        this.priorities = res.data.list;
      },
      error: (err) => {

      },
    });
  }


  loadEmployees(branchId?: number, teamId?: number) {
    if (this.loadingMoreEmployees) return;
    this.loadingMoreEmployees = true;
    let query: any = {
      accountStatus: 1,
      pageIndex: 1,
      pageSize: 1000,
      companyId: this.companyId
    }
    if (teamId) {
      query.teamId = teamId
    }
    else if (Array.isArray(branchId)) {

      branchId.forEach(value => {
        console.log('Selected department ID:', value);
        query.departmentId = value;
      });
    }
    if (this.form.value.departmentIds.length > 0 && !this.firstBind && this.counter > 0) {
      this.employees = [];
      this.firstBind = true;
    }

    console.log(query);
    this.employeeService
      .loadEmployees(query)
      .subscribe({
        next: (response) => {
          console.log(response);

          const newItems = response.data.list
            .filter((item: any) => !this.employees.some((a) => a.id == item.id))
            .map((employee: any) => ({
              ...employee,
              name: `${employee.firstName} ${employee.lastName}`,
            }));


          console.log(this.form.value.EmployeeIds);
          this.employees = [...this.employees, ...newItems];
          this.employeePage++;
          this.loadingMoreEmployees = false;
          if (teamId) {
            response.data.list.map((employee: any) => {
              this.form.patchValue({ EmployeeIds: [...this.form.value.EmployeeIds, employee.id] })
            })
            console.log(this.form.value.EmployeeIds)
          }
          // this.employees=response.data.list;

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

  getEmployeesAssignments() {
    let query = {
      companyId: this.companyId,
      taskId: this.id,
    };

    this.tasksService.assignEmployees(query).subscribe({
      next: (res) => {
        this.assignedEmployees = res.data.list;

        this.selectedEmployeeIds = this.assignedEmployees.map((emp: { employeeId: number }) => emp.employeeId);

        this.updateSelectedEmployeeNames();

        this.form.patchValue({ EmployeeIds: this.selectedEmployeeIds });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }


  updateSelectedEmployeeNames() {

  }

  onSelectionChange() {
    this.selectedEmployeeIds = this.form.value.EmployeeIds;
    this.updateSelectedEmployeeNames();
  }
  getTasksDetails() {
    let query = {
      companyId: this.companyId,
      id: this.id,
      isDelete: false,
    };

    this.tasksService.get(query).subscribe({
      next: (res) => {
        this.taskDetails = res.data.list[0];
        this.populateForm();

        if (this.taskDetails?.branchId) {
          this.onBranchSelect(this.taskDetails.branchId);
        }
      },
      error(err) {
        console.error(err);
      },
    });
  }


  loadBranches(): void {
    this.requestTypeService.getBranches({}).subscribe({
      next: (res) => {
        this.Branches = res.data.list || [];
      },
      error: (err) => console.error(err),
    });
  }
  onBranchSelect(branchId: any): void {
    const branch = this.Branches.find((b) => b.id === branchId);
    if (branch) {
      this.branchId = branch.id;
      this.loadDepartments(branch.id);
    }

    this.form.patchValue({ branchId });
  }
  loadDepartments(branchId: number): void {
    this.requestTypeService.getDepartments({ branchId }).subscribe({
      next: (res) => {
        this.departments = res.data.list || [];
      },
      error: (err) => console.error(err),
    });
  }
  onDepartmentSelect(departmentId: any): void {
    const depArray = this.departments || [];
    const department = this.departments.find((d: any) => d.id === departmentId);
    if (department) {
      this.departmentId = department.id;
    }
    this.form.patchValue({ departmentId });
  }
  cancelTask() {
    this.router.navigate(['/dashboard/tasks']);
  }
  getTeams() {
    if (!this.form.value.isTeam) return; 
  
    let query = {
      companyId: this.companyId,
      associatedToTask: true
    };
  
    this.tasksService.GetTeams(query).subscribe({
      next: (res) => {
        this.Teams = res.data.list;
        console.log("Teams Loaded:", this.Teams);
        this.cdr.detectChanges(); // Force update UI
      },
      error: (err) => {
        console.error("Error loading teams:", err);
      }
    });
  }
  
  onTeamToggle() {
    let newValue = !this.form.value.isTeam; // Manually toggle the value
    this.form.patchValue({ isTeam: newValue }); // Update the form value
  
    if (newValue) {
      this.getTeams(); // Fetch teams only when toggled ON
    } else {
      this.Teams = []; // Reset teams list when toggled OFF
      this.form.patchValue({ teamId: null }); // Reset selected team
    }
  
    this.cdr.detectChanges(); // Ensure UI updates
  
    console.log("Updated isTeam:", this.form.value.isTeam);
  }
  
}
