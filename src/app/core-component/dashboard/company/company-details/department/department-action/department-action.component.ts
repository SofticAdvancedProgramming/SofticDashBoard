import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { branch } from '../../../../../../../models/branch';
import { Department } from '../../../../../../../models/department';
import { InputRestrictionDirective } from '../../../../../../common-component/directives/lang-directive/input-restriction.directive';
import { MapComponent } from '../../../../../../common-component/map/map.component';
import { CompanyService } from '../../../../../../services/comapnyService/company.service';
import { BranchService } from '../../../../../../services/lockupsServices/branchService/branch.service';
import { DepartmentService } from '../../../../../../services/lockupsServices/DepartmentService/department.service';

@Component({
  selector: 'app-department-action',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    MapComponent,
    InputRestrictionDirective
  ],
  templateUrl: './department-action.component.html',
  styleUrl: './department-action.component.css'
})
export class DepartmentActionComponent implements OnInit {
  @Input() department!: Department;
  @Input() isEdit: boolean = false;
  @Output() action = new EventEmitter<boolean>();
  form: FormGroup;
  branches: branch[] = [];
  @Input() companyId?: number;

  descriptionCharacterCount: number = 0;
  descriptionArCharacterCount: number = 0;
  hasCenterlizedDepartment: boolean = false;
  hideBranch: boolean = false;
  constructor(
    private fb: FormBuilder,
    private departmentService: DepartmentService,
    private branchService: BranchService,
    private messageService: MessageService,
    private translate: TranslateService,
    private companyService: CompanyService
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
    this.checkIsCenteralizedCompany();
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
      departmentType: this.department?.isHR ? 'HR' : this.department?.isFinancial ? 'Financial' : null,
      isCentralized: this.department?.isCentralized
    });

    this.hideShowBranch();
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
      branchId: this.form.get('isCentralized')?.value == true ? null : Number(this.form.value.branchId),
      long: this.form.value.long,
      lat: this.form.value.lat,
      isHR: selectedType === 'HR',
      isFinancial: selectedType === 'Financial',
      isCentralized: this.form.value.isCentralized,
    };

    this.departmentService[this.isEdit ? 'editDepartment' : 'addDepartment'](departmentData).subscribe({
      next: (response) => {

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

  checkIsCenteralizedCompany() {
    let companyId = Number(localStorage.getItem("companyId"));
    if (companyId) {
      let body = {
        id: companyId
      }
      this.companyService.getCompany(body).subscribe({
        next:companyData=>{

          this.hasCenterlizedDepartment=companyData.data.list[0].centralizedDepartment;

      }})
    }
  }

  hideShowBranch() {
    const centerlized = this.form.get('isCentralized')?.value;



    const branchControl = this.form.get('branchId');

    if (centerlized) {
      // When centerlizedDepartment is true, remove the 'required' validator
      branchControl?.clearValidators();
      this.hideBranch = true;

    } else {
      // When centerlizedDepartment is false, apply the 'required' validator
      branchControl?.setValidators(Validators.required);
      this.hideBranch = false;
    }

    // Re-evaluate the validity of the 'branch' control after changing validators
    branchControl?.updateValueAndValidity();
  }

  get isArabic():boolean{
    return localStorage.getItem('lang')==='ar'
  }
}
