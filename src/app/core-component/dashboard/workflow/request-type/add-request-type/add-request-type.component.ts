import { string } from '@tensorflow/tfjs-core';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  FormArray
} from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DropDownComponent } from '../../../components/drop-down/drop-down.component';
import { RequestTypeService } from '../../../../../services/requestTypeService/request-type.service';
import { ImageUploadService } from '../../../../../services/ImageUploadService/image-upload.service';
import { ToastrService } from 'ngx-toastr';

/** 
 * Interface for each dynamic row (branch/department/position).
 */
interface RequestConfigForm {
  branchId: FormControl<number | null>;
  departmentId: FormControl<number | null>;
  positionId: FormControl<number | null>;
  rank: FormControl<number | null>;

}

type RequestConfigFormGroup = FormGroup<RequestConfigForm>;


interface AddRequestTypeForm {
  name: FormControl<string | null>;
  nameAr: FormControl<string | null>;
  min: FormControl<number | null>;
  max: FormControl<number | null>;
  RequestTypePhoto: FormControl<string | null>;
  isCustomize: FormControl<boolean>;
  containAsset: FormControl<boolean>;
  requestTypeConfigs: FormArray<RequestConfigFormGroup>;
}
@Component({
  selector: 'app-add-request-type',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterLink,
    RouterLinkActive,
    DropDownComponent,
  ],
  templateUrl: './add-request-type.component.html',
  styleUrls: ['./add-request-type.component.css'],
})
export class AddRequestTypeComponent implements OnInit {
 
  form!: FormGroup<AddRequestTypeForm>;

 
  requestTypeConfigs = this.fb.array<RequestConfigFormGroup>([]);

   RequestCategories: any[] = [];
  Branches: any[] = [];
  departmentOptions: any[][] = [];
  positionOptions: any[][] = [];

   requestTypes: any[] = [];

   fileType: string | null = null;
  uploadMessage: string | null = null;
  uploadedImageBase64: string | null = null;
  selectedFileName: string | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = null;
  PhotoExtension: string | null = null;

   isSubmitting = false;

   selectedRequestCategory: any;
  companyId!: number;

  @Output() RequestAdded = new EventEmitter<void>();

  constructor(
    private requestTypeService: RequestTypeService,
    private fb: FormBuilder,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private imageUploadService: ImageUploadService,
    private toast: ToastrService,
    private router: Router
  ) {
    this.companyId = Number(localStorage.getItem('companyId'));
  }

  ngOnInit(): void {
    this.buildForm();
    this.loadBranchs();
    this.loadRequestCategory();
    this.loadRequestTypes();

     this.form.controls.isCustomize.valueChanges.subscribe((value) => {
      if (!value) {
        this.requestTypeConfigs.clear();
        this.departmentOptions = [];
        this.positionOptions = [];
      }
    });
  }


  private buildForm(): void {
    this.form = this.fb.group<AddRequestTypeForm>({
      name: this.fb.control<string | null>('', [Validators.required]),
      nameAr: this.fb.control<string | null>('', [Validators.required]),
      min: this.fb.control<number | null>(null, [Validators.required]),
      max: this.fb.control<number | null>(null, [Validators.required]),
      RequestTypePhoto: this.fb.control<string | null>(null),
      isCustomize: this.fb.control<boolean>(false, { nonNullable: true }),
       containAsset: this.fb.control<boolean>(false, { nonNullable: true }),
      requestTypeConfigs: this.requestTypeConfigs,
    });
  }
  

  private createConfigGroup(): RequestConfigFormGroup {
    return this.fb.group<RequestConfigForm>({
      branchId: this.fb.control<number | null>(null, { validators: [Validators.required] }),
      departmentId: this.fb.control<number | null>(null, { validators: [Validators.required] }),
      positionId: this.fb.control<number | null>(null, { validators: [Validators.required] }),
      rank: this.fb.control<number | null>(0, { validators: [Validators.required] }),
    });
  }

   addRow(): void {
    this.requestTypeConfigs.push(this.createConfigGroup());
    const rowIndex = this.requestTypeConfigs.length - 1;
     this.departmentOptions[rowIndex] = [];
    this.positionOptions[rowIndex] = [];
  }

   removeRow(index: number): void {
    this.requestTypeConfigs.removeAt(index);
    this.departmentOptions.splice(index, 1);
    this.positionOptions.splice(index, 1);
  }


  loadBranchs(): void {
    this.requestTypeService.getBranches({}).subscribe({
      next: (res) => {
        this.Branches = res.data.list || [];
      },
      error: (err) => console.error(err),
    });
  }

  loadRequestCategory(): void {
    this.requestTypeService.getRequestCategory({}).subscribe({
      next: (res) => {
        this.RequestCategories = res.data.list || [];
      },
      error: (err) => console.error(err),
    });
  }

  loadDepartments(branchId: number, rowIndex: number): void {
    this.requestTypeService.getDepartments({ branchId }).subscribe({
      next: (res) => {
        this.departmentOptions[rowIndex] = res.data.list || [];
      },
      error: (err) => console.error(err),
    });
  }

  loadPositions(departmentId: number, rowIndex: number): void {
    this.requestTypeService.getPositions({ departmentId }).subscribe({
      next: (res) => {
        this.positionOptions[rowIndex] = res.data.list || [];
      },
      error: (err) => console.error(err),
    });
  }

  loadRequestTypes(): void {
    this.requestTypeService
      .getRequestType({ pageSize: 1000, companyId: this.companyId })
      .subscribe({
        next: (res) => {
          this.requestTypes = res.data.list || [];
          this.cdr.detectChanges();
        },
        error: (err) => console.error(err),
      });
  }


  onRequestCategorySelect(requestCategoryId: any): void {
    const requestCategory = this.RequestCategories.find((cat) => cat.id === requestCategoryId);
    if (!requestCategory) return;

    this.selectedRequestCategory = requestCategory;

    if (this.selectedRequestCategory.id === 3) {
      this.form.controls.min.clearValidators();
      this.form.controls.min.updateValueAndValidity();

      this.form.controls.max.clearValidators();
      this.form.controls.max.updateValueAndValidity();
    }
    else {
      this.form.controls.min.setValidators([Validators.required]);
      this.form.controls.min.updateValueAndValidity();

      this.form.controls.max.setValidators([Validators.required]);
      this.form.controls.max.updateValueAndValidity();
    }
  }


  onBranchSelect(branchId: any, rowIndex: number): void {
    const branch = this.Branches.find((b) => b.id === branchId);
    if (branch) {
      this.requestTypeConfigs.at(rowIndex).controls.branchId.setValue(branch.id);
      this.loadDepartments(branch.id, rowIndex);
    }
  }

  onDepartmentSelect(departmentId: any, rowIndex: number): void {
    const depArray = this.departmentOptions[rowIndex] || [];
    const department = depArray.find((d: any) => d.id === departmentId);
    if (department) {
      this.requestTypeConfigs.at(rowIndex).controls.departmentId.setValue(department.id);
      this.loadPositions(department.id, rowIndex);
    }
  }

  onPositionSelect(positionId: any, rowIndex: number): void {
    const posArray = this.positionOptions[rowIndex] || [];
    const position = posArray.find((p: any) => p.id === positionId);
    if (position) {
      this.requestTypeConfigs.at(rowIndex).controls.positionId.setValue(position.id);
    }
  }


  onFileChange(event: any): void {
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
          this.uploadedImageBase64 = base64.replace(/^data:image\/[a-z]+;base64,/, '');
          this.form.controls.RequestTypePhoto.setValue(this.uploadedImageBase64);
          this.cdr.detectChanges();
        })
        .catch((error) => {
          console.error('Error converting file to base64', error);
        });
    }
  }

  private readFile(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (result) {
        this.uploadMessage = this.translate.instant(
          this.fileType?.startsWith('image/')
            ? 'ASSET_UPLOADER.IMAGE_UPLOADED'
            : 'ASSET_UPLOADER.FILE_UPLOADED'
        );
        if (this.fileType?.startsWith('image/')) {
          this.imagePreviewUrl = result;
        }
      }
    };
    reader.readAsDataURL(file);
  }


  isFieldInvalid(field: keyof AddRequestTypeForm): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.dirty || control.touched);
  }

  onSubmit(): void {
    if (this.isSubmitting) return;
    if (!this.form.valid) return;
  
    this.isSubmitting = true;
    const f = this.form.value;
  
    const payload: any = {
      companyId: this.companyId,
      name: f.name,
      nameAr: f.nameAr,
      icon: this.uploadedImageBase64 || null,
      iconExtension: this.PhotoExtension || null,
      max: f.max,
      min: f.min,
       containAsset: f.containAsset,
      isCustomized: f.isCustomize,
      requestCategoryId: this.selectedRequestCategory?.id,
      requestTypeConfigs: [],
    };
  
     if (this.selectedRequestCategory?.id === 3) {
      delete payload.min;
      delete payload.max;
    }
  
     if (f.isCustomize) {
      this.requestTypeConfigs.controls.forEach((group, index) => {
        const g = group.value;
        payload.requestTypeConfigs.push({
          companyId: this.companyId,
          positionId: g.positionId,
          id: 0,
          rank: index + 1,
          requestTypeId: 0,
        });
      });
    }
  
    console.log('Submission Payload:', payload);
  
    this.requestTypeService.addRequestType(payload).subscribe({
      next: (res) => {
        this.toast.success('Request Type Added Successfully');
        console.log('Server response:', res);
  
         this.loadRequestTypes();
        this.RequestAdded.emit();
        this.form.reset();
        this.requestTypeConfigs.clear();
        this.departmentOptions = [];
        this.positionOptions = [];
        this.imagePreviewUrl = null;
        this.fileType = null;
        this.uploadedImageBase64 = null;
        this.PhotoExtension = null;
        this.isSubmitting = false;
      },
    });
  }
  

  deleteRequestType(id: number): void {
    this.requestTypeService.deleteRequestType(id, this.companyId).subscribe({
      next: (res) => {
        this.toast.success('Request Type Deleted Successfully');
        this.loadRequestTypes();
      },

    });
  }

  navigateToDetails(id: number): void {
    this.router.navigate(['/dashboard/workflow/Request-type/details', id]);
  }
}
