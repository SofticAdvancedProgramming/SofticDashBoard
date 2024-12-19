import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { TasksService } from '../../../../services/TasksService/tasks.service';
import { ImageUploadService } from '../../../../services/ImageUploadService/image-upload.service';
import { DropDownComponent } from '../../components/drop-down/drop-down.component';
import { employee } from '../../../../../models/employee';
import { EmployeeService } from '../../../../services/employeeService/employee.service';
import { ToastrService } from 'ngx-toastr';

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
  ],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css',
})
export class AddTaskComponent implements OnInit {
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
  employeePage = 1;
  constructor(
    private fb: FormBuilder,
    private tasksService: TasksService,
    private imageUploadService: ImageUploadService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private employeeService: EmployeeService,
    private toast: ToastrService
  ) {
    this.companyId = Number(localStorage.getItem('companyId'));
  }
  ngOnInit(): void {
    this.initiation();
    this.loadEmployees();
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
      actualCost: [''],
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

  // Remove a specific todo field
  removeTodo(index: number): void {
    this.todos.removeAt(index);
  }

  onSubmit() {
    const todoValues = this.form.value.todos; // Get all to-do values
    console.log('Submitting To-Dos:', todoValues);
    const toDoItems: any[] = [];
    for (let i = 0; i < todoValues.length; i++) {
      toDoItems.push({
        companyId: this.companyId,
        description: todoValues[i],
      });
    }
    console.log(toDoItems);

    let query;
    query = {
      companyId: this.companyId,
      name: this.form.controls['name'].value,
      // taskFile: this.form.controls['taskFile'].value,
      description: this.form.controls['taskDetails'].value,
      startDate: this.form.controls['from'].value,
      initialBudget: this.form.controls['initialCost'].value,
      actualCost: this.form.controls['actualCost'].value,
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
    if (todoValues) {
      query = {
        companyId: this.companyId,
        name: this.form.controls['name'].value,
        // taskFile: this.form.controls['taskFile'].value,
        description: this.form.controls['taskDetails'].value,
        startDate: this.form.controls['from'].value,
        initialBudget: this.form.controls['initialCost'].value,
        actualCost: this.form.controls['actualCost'].value,
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
    console.log(this.form.value);
    if (this.form.value) {
      this.tasksService.add(query).subscribe({
        next: (res) => {
          console.log(res);
          this.toast.success('Added Successfully');
          this.ngOnInit();
        },
        error(err) {
          console.log(err);
        },
      });
    }
  }
  addToDoFun() {
    this.todos.push(this.fb.control(''));
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
      console.log('Selected Employee:', employee);
      this.selectedEmployee = employee;
      console.log('Selected Employee ID:', this.selectedEmployee?.id);
    } else {
      console.log('Employee not found.');
    }
  }
}
