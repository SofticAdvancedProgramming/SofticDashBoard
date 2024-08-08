import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { PasswordValidator } from '../../../../../Modules/passwordValidator';
import { EmployeeService } from '../../../../services/employeeService/employee.service';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { employee } from '../../../../../models/employee';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToastModule],
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css'],
  providers: [MessageService],
})
export class AddEmployeeComponent implements OnInit, OnDestroy {
  addEmployeeForm: FormGroup;
  private destroy$ = new Subject<void>();
  isSubmitting = false;
  passwordFieldType: string = 'password';
  confirmPasswordFieldType: string = 'password';
  companyId: number = 0;
  formValue: employee = {} as employee;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private employeeService: EmployeeService,
    private cdr: ChangeDetectorRef
  ) {
    this.addEmployeeForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.initializeForm();
    this.companyId = Number(localStorage.getItem('companyId')) || 0;
    console.log('Company ID from localStorage:', this.companyId);
  }

  private initializeForm(): void {
    this.addEmployeeForm = this.fb.group({
      id: [0],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      fullName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      password: ['', [Validators.required, PasswordValidator.passwordComplexity()]],
      confirmPassword: ['', Validators.required],
    }, {
      validators: PasswordValidator.passwordMatch('password', 'confirmPassword')
    });
  }

  onSubmit(): void {
    if (this.addEmployeeForm.invalid) {
      this.showError('Invalid Form', 'Please fill in all required fields');
      this.validateAllFormFields(this.addEmployeeForm);
      return;
    }

    this.formValue = {
      ...this.addEmployeeForm.value,
      companyId: this.companyId
    };
    this.isSubmitting = true;
    console.log(this.formValue);

    this.employeeService.addEmployee(this.formValue).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        this.showSuccess('Employee Added', 'Employee has been added successfully');
        this.router.navigate(['/dashboard/indexCompany']).then(success => {
          if (success) {
            console.log('Navigation to employee list successful');
          } else {
            console.error('Navigation to employee list failed');
          }
        }).catch(error => {
          console.error('Navigation error:', error);
        });
      },
      error: (err: any) => {
        console.error('Adding employee failed:', err);
        this.isSubmitting = false;
        this.addEmployeeForm.reset();
        this.showError('Adding Failed', 'Employee could not be added, please try again');
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
    const control = this.addEmployeeForm.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
