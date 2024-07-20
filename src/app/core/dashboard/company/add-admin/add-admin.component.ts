import { ChangeDetectorRef, Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AdminService } from '../../../../services/adminService/admin.service';
import { PasswordValidator } from '../../../../../Modules/passwordValidator';

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
  addCompanyForm: FormGroup;
  private destroy$ = new Subject<void>();
  isSubmitting = false;
  passwordFieldType: string = 'password';
  confirmPasswordFieldType: string = 'password';
  companyId: number = 0;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) {
    this.addCompanyForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.initializeForm();
    this.route.queryParams.subscribe((params: any) => {
      this.companyId = params['companyId'];
      console.log('Company ID:', this.companyId);
    });
  }

  private initializeForm(): void {
    this.addCompanyForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      password: ['', [Validators.required, PasswordValidator.passwordComplexity()]],
      confirmPassword: ['', Validators.required],
      companyId: [0]
    }, {
      validators: PasswordValidator.passwordMatch('password', 'confirmPassword')
    });
  }

  onSubmit(): void {
    if (this.addCompanyForm.invalid) {
      this.showError('Invalid Form', 'Please fill in all required fields');
      this.validateAllFormFields(this.addCompanyForm);
      return;
    }

    const formValue = this.addCompanyForm.value;
    this.isSubmitting = true;
    this.adminService.AddAdmin(formValue).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        this.showSuccess('Admin Added', 'Admin has been added successfully');
        this.router.navigate(['/admin-list']).then(success => {
          if (success) {
            console.log('Navigation to admin list successful');
          } else {
            console.error('Navigation to admin list failed');
          }
        }).catch(error => {
          console.error('Navigation error:', error);
        });
      },
      error: (err: any) => {
        console.error('Adding admin failed:', err);
        this.isSubmitting = false;
        this.addCompanyForm.reset();
        this.showError('Adding Failed', 'Admin could not be added, please try again');
      }
    });
  }

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
  }

  private showError(message: string, details: string): void {
    this.messageService.add({
      severity: 'error',
      summary: message,
      detail: details,
    });
    this.cdr.markForCheck();
  }

  private showSuccess(message: string, details: string): void {
    this.messageService.add({
      severity: 'success',
      summary: message,
      detail: details,
    });
    this.cdr.markForCheck();
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
    const control = this.addCompanyForm.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
