import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DropDownComponent } from '../../../components/drop-down/drop-down.component';
import { RequestTypeService } from '../../../../../services/requestTypeService/request-type.service';
import { ImageUploadService } from '../../../../../services/ImageUploadService/image-upload.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-request-type',
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
  templateUrl: './add-request-type.component.html',
  styleUrl: './add-request-type.component.css',
})
export class AddRequestTypeComponent implements OnInit {
  form!: FormGroup;
  files: any[] = [];
  attachmentfileType: any;
  RequestTypes: any[] = [];
  RequestCategories: any[] = [];
  Branches: any[] = [];
  Departments: any[] = [];
  Positions: any[] = [];
  DepartmentPage: any;
  RequestCategoryPage: any;
  BranchPage: any;
  PositionPage: any;
  requestTypes: any[] = [];
  requestTypeId!: any;
  selectedBranch: any;
  selectedDepartment: any;
  selectedPosition: any;
  selectedRequestCategory: any;
  companyId!: number;
  fileType: string | null = null;
  uploadMessage: string | null = null;
  uploadedImageBase64: any;
  selectedFileName: string | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = null;
  PhotoExtension: any;
  requestTypeConfigs: any[] = [];
  newPosition: number[] = [1];
  rankNum: number = 0;
  @Output() RequestAdded = new EventEmitter<void>();
  constructor(
    private requestTypeService: RequestTypeService,
    private fb: FormBuilder,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private imageUploadService: ImageUploadService,
    private toast: ToastrService
  ) {
    this.companyId = Number(localStorage.getItem('companyId'));
  }
  ngOnInit(): void {
    this.loadBranchs();
    this.loadRequestCategory();
    this.initiation();
  }
  initiation() {
    this.form = this.fb.group({
      titleEn: ['', Validators.required],
      titleAr: ['', Validators.required],
      maxDays: ['', Validators.required],
      RequestTypePhoto: [],
      isCustomize: [false],
    });
  }
  addNew() {
    this.newPosition.push(1);
  }
  valuesArray: any[] = []; // Array to store added values
  // Add the current form's values to the array
  addValue() {
    this.rankNum+=1;
    if (this.form.get('isCustomize')?.value) {
      this.valuesArray.push({
        companyId: null,
        positionId: this.selectedPosition.id,
        id: 0,
        rank: this.rankNum,
        requestTypeId: 0,
      }); // Add values to the array
      // this.dynamicForm.reset(); // Reset form for new input
    } else {
      alert('Please fill all fields correctly!');
    }
    console.log(this.valuesArray);
  }

  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return control
      ? control.invalid && (control.dirty || control.touched)
      : false;
  }

  loadRequestCategory() {
    this.requestTypeService.getRequestCategory({}).subscribe({
      next: (res) => {
        this.RequestCategories = res.data.list;
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  onRequestCategorySelect(requestCategoryId: any) {
    const requestCategory = this.RequestCategories.find(
      (requestCategory: any) => requestCategory.id === requestCategoryId
    );

    if (requestCategory) {
      console.log('Selected Branch:', requestCategory);
      this.selectedRequestCategory = requestCategory;
      this.loadDepartments(this.selectedRequestCategory.id);
      console.log('Selected Branch ID:', this.selectedRequestCategory?.id);
    } else {
      console.log('Branch not found.');
    }
  }

  onFileChange(event: any): void {
    console.log('onFileChange');
    const file = event.target.files[0];
    if (file) {
      const fileName = file.name;
      this.PhotoExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
      this.fileType = file.type;
      this.selectedFileName = file.name;
      this.readFile(file);
      this.imageUploadService
        .convertFileToBase64(file)
        .then((base64) => {
          this.uploadedImageBase64 = base64;
          this.uploadedImageBase64 = base64.replace(
            /^data:image\/[a-z]+;base64,/,
            ''
          );
          this.form.patchValue({ photo: this.uploadedImageBase64 });
          this.cdr.detectChanges();
        })
        .catch((error) => {
          console.error('Error converting file to base64', error);
        });
    }
  }
  readFile(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string | null;
      if (result) {
        const base64String = result.split(',')[1];
        this.uploadMessage = this.translate.instant(
          this.fileType?.startsWith('image/')
            ? 'ASSET_UPLOADER.IMAGE_UPLOADED'
            : 'ASSET_UPLOADER.FILE_UPLOADED'
        );
        if (this.fileType?.startsWith('image/')) {
          this.imagePreviewUrl = result;
          console.log(this.imagePreviewUrl);
        }
      }
    };
    reader.readAsDataURL(file);
  }

  loadBranchs() {
    this.requestTypeService.getBranches({}).subscribe({
      next: (res) => {
        this.Branches = res.data.list;
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  onBranchSelect(branchId: any) {
    const branch = this.Branches.find((branch: any) => branch.id === branchId);

    if (branch) {
      console.log('Selected Branch:', branch);
      this.selectedBranch = branch;
      this.loadDepartments(this.selectedBranch.id);
      console.log('Selected Branch ID:', this.selectedBranch?.id);
    } else {
      console.log('Branch not found.');
    }
  }

  loadDepartments(id: any) {
    this.requestTypeService.getDepartments({ branchId: id }).subscribe({
      next: (res) => {
        this.Departments = res.data.list;
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  onDepartmentSelect(departmentId: any) {
    const department = this.Departments.find(
      (department: any) => department.id === departmentId
    );

    if (department) {
      console.log('Selected department:', department);
      this.selectedDepartment = department;
      this.loadPositions(this.selectedDepartment.id);
      console.log('Selected department ID:', this.selectedDepartment?.id);
    } else {
      console.log('department not found.');
    }
  }

  loadPositions(id: any) {
    this.requestTypeService.getPositions({ departmentId: id }).subscribe({
      next: (res) => {
        this.Positions = res.data.list;
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  onPositionSelect(positionId: any) {
    const position = this.Positions.find(
      (position: any) => position.id === positionId
    );

    if (position) {
      console.log('Selected Position:', position);
      this.selectedPosition = position;
      this.addValue();
      // this.getSubAssetsCategories(this.selectedAsset.id);
      console.log('Selected Position ID:', this.selectedPosition?.id);
    } else {
      console.log('Position not found.');
    }
  }

  onAttachmentChange(event: any) {}
  up(requestType: any) {}
  down(requestType: any) {}
  deleterequestType(requestType: any) {}

  onSubmit() {
    let query: any;
    query = {
      companyId: null,
      name: this.form.value.titleEn,
      nameAr: this.form.value.titleAr,
      icon: this.uploadedImageBase64,
      iconExtension: this.PhotoExtension,
      maxDays: this.form.value.maxDays,
      isCustomized: false,
      requestCategoryId: this.selectedRequestCategory.id,
    };
    if (this.form.get('isCustomize')?.value) {
      query = {
        companyId: null,
        name: this.form.value.titleEn,
        nameAr: this.form.value.titleAr,
        icon: this.uploadedImageBase64,
        iconExtension: this.PhotoExtension,
        maxDays: this.form.value.maxDays,
        isCustomized: this.form.value.isCustomize,
        requestCategoryId: this.selectedRequestCategory.id,
        requestTypeConfigs: this.valuesArray
      };
    }
    console.log(query);

    this.requestTypeService.addRequestType(query).subscribe({
      next: (res) => {
        console.log(res);
        this.toast.success('Request Type Added Successfully');
        this.ngOnInit();
        this.cdr.detectChanges();
        this.RequestAdded.emit();
        this.form.reset();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
