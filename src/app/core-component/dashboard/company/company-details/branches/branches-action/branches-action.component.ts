import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { branch } from '../../../../../../../models/branch';
import { InputRestrictionDirective } from '../../../../../../common-component/directives/lang-directive/input-restriction.directive';
import { MapComponent } from '../../../../../../common-component/map/map.component';
import { BranchService } from '../../../../../../services/lockupsServices/branchService/branch.service';

@Component({
  selector: 'app-branches-action',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    MapComponent,
    TranslateModule,
    InputRestrictionDirective,
  ],
  templateUrl: './branches-action.component.html',
  styleUrl: './branches-action.component.css',
})
export class BranchesActionComponent implements OnInit {
  @Input() isEdit: boolean = false;
  @Input() branch!: branch;
  @Input() companyId?: number;
  @Output() action = new EventEmitter<boolean>();
  @Output() branchAdded = new EventEmitter<void>();

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private branchService: BranchService,
    private messageService: MessageService,
    private translate: TranslateService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      nameAr: ['', Validators.required],
      long: [0, Validators.required],
      lat: [0, Validators.required],
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
  }

  initoForm() {
    this.form.patchValue({
      name: this.branch?.name,
      nameAr: this.branch?.nameAr,
      long: this.branch?.long,
      lat: this.branch?.lat,
    });
  }

  onSave(): void {
    if (this.form.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: this.translate.instant('addBranch.PLEASE_FILL_REQUIRED_FIELDS'),
      });
      this.ngOnInit();
      return;
    }

    const branchData: branch = {
      id: this.branch?.id || 0,
      companyId: this.companyId || 0,
      name: this.form.value.name,
      nameAr: this.form.value.nameAr,
      long: this.form.value.long,
      lat: this.form.value.lat,
    };

    this.branchService[this.isEdit ? 'editBranch' : 'addBranch'](
      branchData
    ).subscribe({
      next: (response) => {
        //  console.log('Branch added successfully', response);

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.isEdit
            ? this.translate.instant('addBranch.BRANCH_EDITED_SUCCESSFULLY')
            : this.translate.instant('addBranch.BRANCH_ADDED_SUCCESSFULLY'),
        });

        if (this.isEdit) {
          setTimeout(() => {
            this.branchAdded.emit();
            this.action.emit(false);
          }, 1000);
        } else {
          this.form.reset();
          this.action.emit(false);
        }
      },
      error: (err) => {
        console.error('Error adding/editing branch:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.translate.instant('addBranch.FAILED_TO_ADD_BRANCH'),
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
}
