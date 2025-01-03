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
  // todoGroup: any;
  assignedEmployees: any;
  isDelete: boolean = false;
  todoGroup!: FormGroup;
  Branches: any[] = [];
  departments: any[] = [];
  branchId: any;
  departmentId: any;
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
    this.route.params.subscribe((params) => {
      const id = params['id'];
      this.id = params['id'];
      if (id) {
        
      }
    });
    this.initiation();
    this.loadEmployees();
    this.getPriorities();
    this.loadBranches();
    this.todayDate = new Date().toISOString().split('T')[0];
    if (this.id) {
      this.getTaksDetails();
      this.getEmployeesAssignments();
      this.getTodoItems();
    }
  }
  initiation() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      taskDetails: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(300),
        ],
      ],
      from: ['', Validators.required],
      initialCost: [''],
      duration: ['', Validators.required],
      taskToDoDescription: [''],
      AssetAttachment: [''],
      isGlobal: [false],
      priority: [''],
      todos: this.fb.array([]), // Initialize the FormArray
      EmployeeIds: [[]] // Initialize as an empty array
    });
  }
  // Getter for the todos FormArray
  get todos(): FormArray {
    return this.form.get('todos') as FormArray;
  }
  addToDoFun() {
    this.todos.push(
      this.fb.group({
        description: ['', Validators.required],
        employeeId: [null, Validators.required], // Dropdown selection
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
        
        // this.todos.reset();
        this.todoItems?.forEach((todo: any) => {
          const todoGroup1: any = this.fb.group({
            description: [todo.description, Validators.required],
            employeeId: [todo.employeeId, Validators.required],
            id: [todo.id],
          });
          // this.form.setControl('todos', todoGroup);
          this.todos.push(todoGroup1);
          
          
        });
      },
      error: (err) => {
       
      },
    });
  }

  // Remove a specific todo field
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
    // Populate static fields
    this.form.patchValue({
      name: this.taskDetails?.name,
      taskDetails: this.taskDetails?.description,
      from: formattedDate || '', // Provide default if missing
      initialCost: this.taskDetails?.initialBudget,
      taskToDoDescription: [''],
      AssetAttachment: [''],
      duration: this.taskDetails?.duration,
      priority: this.taskDetails?.priorityId,
    });
   

    // Clear existing todos
    this.form.setControl('todos', this.fb.array([]));
    

    // Populate todos FormArray

    // this.todoGroup.reset();
    // this.todos.reset();
    // this.todoItems?.forEach((todo: any) => {
    //   this.todoGroup= this.fb.group({
    //     description: [todo.description, Validators.required],
    //     employeeId: [todo.employeeId, Validators.required],
    //     id: [todo.id],
    //   });
    //   // this.form.setControl('todos', todoGroup);
    //   this.todos.push(this.todoGroup);
    // });
  }

  onSubmit() {
    console.log(this.form.value.EmployeeIds);
    
    this.todoValues = this.form.value.todos; // Get all to-do values
    
    const toDoItems: any[] = [];
    for (let i = 0; i < this.todoValues.length; i++) {
      toDoItems.push({
        companyId: this.companyId,
        id: this.todoValues[i].id,
        ...this.todoValues[i],
      });
    }
    let query: any;
    query = {
      companyId: this.companyId,
        name: this.form.controls['name'].value,
        // taskFile: this.form.controls['taskFile'].value,
        description: this.form.controls['taskDetails'].value,
        startDate: this.form.controls['from'].value,
        initialBudget: this.form.controls['initialCost'].value,
        statusId: 1,
        duration: this.form.controls['duration'].value,
        taskAttachments: this.attachments
        // departmentIds: this.form.value.EmployeeIds
    };
    if (this.todoValues) {
      query.toDoItems = toDoItems;
    }
    if(this.form.controls['priority'].value){
      query.priorityId = this.form.controls['priority'].value
    }
    if (this.selectedEmployee?.id) {
      query.taskAssignments = [
        {
          companyId: this.companyId,
          employeeId: this.selectedEmployee.id,
        },
      ];
    } else {
      query.taskAssignments = []
    }
    if(this.form.value.EmployeeIds){
      query.isGlobal = false;
      query.departmentIds = this.form.value.EmployeeIds;
    }
    if(this.form.value.isGlobal){
      query.isGlobal = true;
      query.departmentIds = [];
    }
   
    if (this.id) {
      
      query.id = this.id;
    }

    if (this.form.value) {
      if (this.id) {
        this.tasksService.edit(query).subscribe({
          next: (res) => {
         
            this.toast.success('Edited Successfully');
            this.ngOnInit();
          },
          error(err) {
           
          },
        });
      } else {
        this.tasksService.add(query).subscribe({
          next: (res) => {
        
            this.toast.success('Added Successfully');
            this.ngOnInit();
            this.router.navigateByUrl('/dashboard/tasks');
          },
          error(err) {
           
          },
        });
      }
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

          // If the file is an image, add a preview URL
          if (attachmentfileType.startsWith('image/')) {
            this.attachmentImagePreviewUrl = result;
            
          }

          // Add the file to the array
          this.files.push(fileDetails);
         

          // Update message
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

  loadEmployees() {
    if (this.loadingMoreEmployees) return;
    this.loadingMoreEmployees = true;

    this.employeeService
      .loadEmployees({
        accountStatus: 1,
        pageIndex: this.employeePage,
        pageSize: 1000,
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
  getEmployeesAssignments() {
    let query = {
      companyId: this.companyId,
      taskId: this.id,
    };
    this.tasksService.assignEmployees(query).subscribe({
      next: (res) => {
     
        this.assignedEmployees = res.data.list;
      },
      error: (err) => {
     
      },
    });
  }
  getTaksDetails() {
    let query = {
      companyId: this.companyId,
      id: this.id,
      isDelete: false,
    };
    this.tasksService.get(query).subscribe({
      next: (res) => {
       
        this.taskDetails = res.data.list[0];
        this.populateForm();
        // this.form = this.fb.group({
        //   // laborCost: [this.taskDetails.laborCost, Validators.required],
        //   // materialCost: [this.taskDetails.materialCost, Validators.required],
        //   // serviceCost: [this.taskDetails.serviceCost, Validators.required],
        //   // additionalCost: [this.taskDetails.additionalCost, Validators.required],
        //   name: [this.taskDetails.name, Validators.required],
        //   // taskFile: ['', Validators.required],
        //   taskDetails: [
        //     this.taskDetails.description,
        //     [
        //       Validators.required,
        //       Validators.minLength(5),
        //       Validators.maxLength(300),
        //     ],
        //   ],
        //   from: [formattedDate, Validators.required],
        //   initialCost: [this.taskDetails.initialBudget],
        //   actualCost: [''],
        //   duration: [this.taskDetails.duration, Validators.required],
        //   taskToDoDescription: [''],
        //   AssetAttachment: [''],
        //   todos: this.fb.array([]), // Initialize the FormArray
        // });
        // this.selectedEmployee = this.assignedEmployees[0]?.employeeId;
        // console.log(this.selectedEmployee);
        // for (let i = 0; i <= this.taskDetails.toDoItems.length; i++) {
        //   this.todoGroup = this.fb.group({
        //     description: [
        //       this.taskDetails.toDoItems[i].description,
        //       Validators.required,
        //     ],
        //     employeeId: [
        //       this.taskDetails.toDoItems[i].employeeId,
        //       Validators.required,
        //     ], // Dropdown selection
        //   });

        // if(this.id){
        //   // this.todos.push(this.todoGroup);
        //   // this.todos.patchValue(this.todoGroup);
        //   // this.form.setControl('todos', this.todoGroup);
        // }
        // else{
        //   // this.todos.push(this.todoGroup);
        // }
        // console.log(this.todoGroup);
        // console.log(this.todos);
        // }
      },
      error(err) {
       
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
      // this.requestTypeConfigs.at(rowIndex).controls.branchId.setValue(branch.id);
      this.branchId = branch.id;
      this.loadDepartments(branch.id);
    }
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
      // this.requestTypeConfigs.at(rowIndex).controls.departmentId.setValue(department.id);
      // this.loadPositions(department.id, rowIndex);
    }
  }

}
