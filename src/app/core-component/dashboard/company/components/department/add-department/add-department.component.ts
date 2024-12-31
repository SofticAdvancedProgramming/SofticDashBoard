// add-department.component.ts
import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DepartmentService } from '../../../../../../services/lockupsServices/DepartmentService/department.service';
import { Department } from '../../../../../../../models/department';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { BranchService } from '../../../../../../services/lockupsServices/branchService/branch.service';
import { branch } from '../../../../../../../models/branch';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { InputRestrictionDirective } from '../../../../../../common-component/directives/lang-directive/input-restriction.directive';
import { MapComponent } from '../../../../../../common-component/map/map.component';

@Component({
  selector: 'app-add-department',
  standalone: true,
  templateUrl: './add-department.component.html',
  styleUrls: ['./add-department.component.css'],
  providers: [MessageService],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    MapComponent,
    InputRestrictionDirective
  ]
})
export class AddDepartmentComponent implements OnInit {
  @Input() department!: Department;
  @Input() isEdit: boolean = false;
  @Output() action = new EventEmitter<boolean>();
  form: FormGroup;
  branches: branch[] = [];
  @Input() companyId?: number;

  descriptionCharacterCount: number = 0;
  descriptionArCharacterCount: number = 0;

  constructor(
    private fb: FormBuilder,
    private departmentService: DepartmentService,
    private branchService: BranchService,
    private messageService: MessageService,
    private translate: TranslateService
  ) {
     this.form = this.fb.group({
      name: ['', Validators.required],
      nameAr: ['', Validators.required],
      shortName: ['', Validators.required],
      long: [0, Validators.required],
      lat: [0, Validators.required],
      manager: [''],
      branchId: [null, Validators.required],
      description: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(250)]],
      descriptionAr: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(250)]],
      departmentType: [null],
      isCentralized: [false],
        });
  }

  ngOnInit(): void {
    const storedCompanyId = localStorage.getItem('companyId');
    if (storedCompanyId) {
      this.companyId = Number(storedCompanyId);
    }
    if (this.isEdit) {
      this.initoForm();
    }
    this.loadBranches();
    this.updateCharacterCount('description');
    this.updateCharacterCount('descriptionAr');
  }

  initoForm() {
    this.form.patchValue({
      name: this.department?.name,
      nameAr: this.department?.nameAr,
      shortName: this.department?.shortName,
      long: this.department?.long,
      lat: this.department?.lat,
      branchId: this.department?.branchId,
      description: this.department?.description,
      descriptionAr: this.department?.descriptionAr,
      departmentType: this.department?.isHR ? 'HR' : this.department?.isFinancial ? 'Financial' : null
    });
  }

  loadBranches(): void {
    if (this.companyId === undefined) {
      this.showError('Company ID is missing.');
      return;
    }

    this.branchService.getBranch({ companyId: this.companyId }).subscribe({
      next: (response) => {
        this.branches = response.data.list;
      },
      error: (err) => {
        console.error('Error loading branches:', err);
        this.showError('Failed to load branches. Please try again later.');
      }
    });
  }

  onSave(): void {
    if (this.form.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all required fields',
      });
      return;
    }
  
    const selectedType = this.form.value.departmentType;
  
    const departmentData: Department = {
      id: this.isEdit && this.department ? this.department.id : 0,
      companyId: this.companyId || 0,
      name: this.form.value.name,
      shortName: this.form.value.shortName,
      nameAr: this.form.value.nameAr,
      description: this.form.value.description,
      descriptionAr: this.form.value.descriptionAr,
      branchId: Number(this.form.value.branchId),
            long: this.form.value.long,
      lat: this.form.value.lat,
      isHR: selectedType === 'HR',
      isFinancial: selectedType === 'Financial',
      isCentralized: this.form.value.isCentralized,  
    };
  
    this.departmentService[this.isEdit ? 'editDepartment' : 'addDepartment'](departmentData).subscribe({
      next: (response) => {
        console.log('Department saved successfully', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Department saved successfully',
        });
        this.action.emit(false);
        if (!this.isEdit) {
          this.form.reset({
            departmentType: null,
            long: 0,
            lat: 0,
            isCentralized: false, // Reset the checkbox
          });
        }
      },
      error: (err) => {
        console.error('Error saving department:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error saving department',
        });
      },
    });
  }
  


  onBack(): void {
    this.action.emit(false);
  }

  onLocationSelected(location: { lat: number; lng: number }): void {
    this.form.patchValue({ lat: location.lat, long: location.lng });
  }

  updateCharacterCount(controlName: string): void {
    const control = this.form.get(controlName);
    if (control) {
      const valueLength = control.value ? control.value.length : 0;
      if (controlName === 'description') {
        this.descriptionCharacterCount = valueLength;
      } else if (controlName === 'descriptionAr') {
        this.descriptionArCharacterCount = valueLength;
      }
    }
  }

  private showError(detail: string): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail });
  }
}
