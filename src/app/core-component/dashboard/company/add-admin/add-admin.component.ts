import { ToastersService } from './../../../../core/services/toast-service/toast.service';
import { ChangeDetectorRef, Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AdminService } from '../../../../services/adminService/admin.service';
import { PasswordValidator } from '../../../../../Modules/passwordValidator';
import { Company } from '../../../../../models/company';

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, ToastModule, RouterLink],
  providers: [MessageService, AdminService],
})
export class AddAdminComponent implements OnInit, OnDestroy {
  addAdminForm: FormGroup;
  private destroy$ = new Subject<void>();
  isSubmitting = false;
  passwordFieldType: string = 'password';
  confirmPasswordFieldType: string = 'password';
  companyId: number = Number(localStorage.getItem('companyId'));
  formValue: Company = {} as Company;
  constructor(
    private fb: FormBuilder,
    private toastersService: ToastersService,
    private adminService: AdminService,
    private route: ActivatedRoute,
  ) {
    this.addAdminForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.initializeForm();
    this.route.queryParams.subscribe((params: any) => {
      if (params['companyId']) {
        this.companyId = params['companyId'];
      }
    });
  }

  private initializeForm(): void {
    this.addAdminForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      password: ['', [Validators.required, PasswordValidator.passwordComplexity()]],
      confirmPassword: ['', Validators.required],
      companyId: this.companyId
    }, {
      validators: PasswordValidator.passwordMatch('password', 'confirmPassword')
    });
  }

  onSubmit(): void {
    if (this.addAdminForm.invalid) {
      this.toastersService.typeError('Please fill in all required fields');
      this.validateAllFormFields(this.addAdminForm);
      return;
    }
    this.formValue = this.addAdminForm.value;
    this.formValue.companyId = Number(this.companyId)
    this.adminService.AddAdmin(this.formValue).subscribe({
      next: (response: any) => {
        this.toastersService.typeSuccess('Admin has been added successfully', 'Admin Added');
        this.addAdminForm.reset();
      }
    });
  }

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
  }

  private validateAllFormFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      } else {
        control?.markAsTouched({ onlySelf: true });
      }
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.addAdminForm.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
