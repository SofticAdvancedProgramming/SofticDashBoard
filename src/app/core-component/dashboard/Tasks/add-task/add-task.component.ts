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
  selectedEmployee: any;
  loadingMoreEmployees = false;
  todayDate: string = '';
  employeePage = 1;
  taskDetails: any;
  todoValues: any;
  todoGroup: any;
  assignedEmployees: any;
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
    private router: Router
  ) {
    this.companyId = Number(localStorage.getItem('companyId'));
  }
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      this.id = params['id'];
      if (id) {
        console.log('Extracted taskId:', id);
      }
    });
    this.initiation();
    this.loadEmployees();
    this.todayDate = new Date().toISOString().split('T')[0];
    if (this.id) {
      this.getTaksDetails();
      this.getEmployeesAssignments();
    }
  }
  initiation() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      // taskFile: ['', Validators.required],
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
      todos: this.fb.array([]), // Initialize the FormArray
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

    // Clear the existing FormArray
    // this.todos.clear();

    // Populate the FormArray with backend data
    //   if(this.id){
    //   this.taskDetails.toDoItems.forEach((item: any) => {
    //     const todoGroup = this.fb.group({
    //       description: [item.description, Validators.required],
    //       assignEmployee: [item.assignEmployee, Validators.required],
    //     });
    //     this.todos.push(todoGroup);
    //   });
    // }else{
    //     const todoGroup = this.fb.group({
    //       description: ['', Validators.required],
    //       assignEmployee: ['', Validators.required],
    //     });
    //     this.todos.push(todoGroup);
    // }
  }
  // Remove a specific todo field
  removeTodo(index: number): void {
    this.todos.removeAt(index);
  }

  populateForm() {
    console.log("this.taskDetails,",this.taskDetails);

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
    });
    console.log(this.form.value);

    // Clear existing todos
    this.form.setControl('todos', this.fb.array([]));
    console.log("todos",this.todos)

    // Populate todos FormArray
    this.taskDetails?.toDoItems.forEach((todo: any) => {
      const todoGroup: any = this.fb.group({
        description: [todo.description, Validators.required],
        employeeId: [todo.employeeId, Validators.required],
        id:[todo.id]
      });
      // this.form.setControl('todos', todoGroup);
      this.todos.push(todoGroup);
    });
  }

  onSubmit() {
    this.todoValues = this.form.value.todos; // Get all to-do values
    console.log('Submitting To-Dos:', this.todoValues);
    const toDoItems: any[] = [];
    for (let i = 0; i < this.todoValues.length; i++) {
      toDoItems.push({
        companyId: this.companyId,
        id:this.todoValues[i].id,
        ...this.todoValues[i]
      });
    }
    console.log(toDoItems);

    let query: any;
    if (this.selectedEmployee?.id) {
      query = {
        companyId: this.companyId,
        name: this.form.controls['name'].value,
        // taskFile: this.form.controls['taskFile'].value,
        description: this.form.controls['taskDetails'].value,
        startDate: this.form.controls['from'].value,
        initialBudget: this.form.controls['initialCost'].value,
        statusId: 1,
        duration: this.form.controls['duration'].value,
        taskAttachments: this.attachments,
        taskAssignments: [
          {
            companyId: this.companyId,
            employeeId: this.selectedEmployee.id,
          },
        ],
      };
  
      if (this.todoValues) {
        query = {
          companyId: this.companyId,
          name: this.form.controls['name'].value,
          // taskFile: this.form.controls['taskFile'].value,
          description: this.form.controls['taskDetails'].value,
          startDate: this.form.controls['from'].value,
          initialBudget: this.form.controls['initialCost'].value,
          statusId: 1,
          duration: this.form.controls['duration'].value,
          taskAttachments: this.attachments,
          taskAssignments: [
            {
              companyId: this.companyId,
              employeeId: this.selectedEmployee.id,
            },
          ],
          toDoItems: toDoItems,
        };
      }
    } else {
      query = {
        companyId: this.companyId,
        name: this.form.controls['name'].value,
        // taskFile: this.form.controls['taskFile'].value,
        description: this.form.controls['taskDetails'].value,
        startDate: this.form.controls['from'].value,
        initialBudget: this.form.controls['initialCost'].value,
        statusId: 1,
        duration: this.form.controls['duration'].value,
        taskAttachments: this.attachments,
        taskAssignments: [],
        toDoItems: toDoItems,
      };
    }
    console.log(this.form.value);
    if (this.id) {
      console.log("edit mode",this.id)
      query.id = this.id;
    }
    if (this.form.value) {
      if (this.id) {
        this.tasksService.edit(query).subscribe({
          next: (res) => {
            console.log(res);
            this.toast.success('Edited Successfully');
            this.ngOnInit();
          },
          error(err) {
            console.log(err);
          },
        });
      } else {
        this.tasksService.add(query).subscribe({
          next: (res) => {
            console.log(res);
            this.toast.success('Added Successfully');
            this.ngOnInit();
            this.router.navigateByUrl('/dashboard/tasks');
          },
          error(err) {
            console.log(err);
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
    console.log('onAttachmentChange');

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
            console.log(this.attachmentImagePreviewUrl);
          }

          // Add the file to the array
          this.files.push(fileDetails);
          console.log(fileDetails);
          console.log(this.attachments);

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
          console.log(response);
          const newItems = response.data.list
            .filter((item: any) => !this.employees.some((a) => a.id == item.id))
            .map((employee: any) => ({
              ...employee,
              name: `${employee.firstName} ${employee.lastName}`,
            }));

          this.employees = [...this.employees, ...newItems];
          this.employeePage++;
          this.loadingMoreEmployees = false;
          console.log(this.employees);
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
      console.log('Selected Employee:', employee);
      this.selectedEmployee = employee;
      console.log('Selected Employee ID:', this.selectedEmployee?.id);
    } else {
      console.log('Employee not found.');
    }
  }
  getEmployeesAssignments() {
    let query = {
      companyId: this.companyId,
      taskId: this.id,
    };
    this.tasksService.assignEmployees(query).subscribe({
      next: (res) => {
        console.log(res);
        this.assignedEmployees = res.data.list;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getTaksDetails() {
    let query = {
      companyId: this.companyId,
      id: this.id,
    };
    this.tasksService.get(query).subscribe({
      next: (res) => {
        console.log(res);
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
        console.log(err);
      },
    });
  }
}
