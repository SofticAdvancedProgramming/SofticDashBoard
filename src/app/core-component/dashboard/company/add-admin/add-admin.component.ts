import { routes } from './../../../../app.routes';
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
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CountryISO, NgxIntlTelInputModule, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, ToastModule, RouterLink, TranslateModule, NgxIntlTelInputModule],
  providers: [MessageService, AdminService],
})
export class AddAdminComponent implements OnInit, OnDestroy {
  addAdminForm: FormGroup;
  private destroy$ = new Subject<void>();
  isSubmitting = false;
  passwordFieldType: string = 'password';
  confirmPasswordFieldType: string = 'password';
  companyId: number | null = null;
  formValue: Company = {} as Company;
  preferredCountries = [CountryISO.Egypt, CountryISO.SaudiArabia];
  searchCountryFields = [SearchCountryField.Name, SearchCountryField.DialCode, SearchCountryField.Iso2];
  selectedCountryISO = CountryISO.Egypt;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;

  constructor(
    private fb: FormBuilder,
    private toastersService: ToastersService,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef

  ) {
    this.addAdminForm = this.fb.group({});
  }

  ngOnInit(): void {
     this.route.queryParams.subscribe((params) => {
      this.companyId = params['companyId'] ? +params['companyId'] : null;
      if (this.companyId) {
        this.initializeForm();
      } else {
        console.error('No companyId found in route parameters.');
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
      companyId: [this.companyId],
        }, {
      validators: PasswordValidator.passwordMatch('password', 'confirmPassword')
    });
  }

  onSubmit(): void {
    if (this.addAdminForm.invalid) {
      this.toastersService.typeError(this.translate.instant('addAdminPage.validation.requiredFields'));
      this.validateAllFormFields(this.addAdminForm);
      return;
    }
  
     const formValue = { ...this.addAdminForm.value };
  
     if (formValue.phoneNumber && formValue.phoneNumber.e164Number) {
      formValue.phoneNumber = formValue.phoneNumber.e164Number;
    } else {
      this.toastersService.typeError(this.translate.instant('addAdminPage.validation.invalidPhoneNumber'));
      return;
    }
  
    
  
     this.adminService.AddAdmin(formValue).subscribe({
      next: (response: any) => {
        this.toastersService.typeSuccess(
          this.translate.instant('addAdminPage.toasts.adminAddedSuccess'),
          this.translate.instant('addAdminPage.toasts.successTitle')
        );
        this.addAdminForm.reset();
        this.router.navigate(['dashboard']);
      },
      error: (err) => {
        console.error('Error adding admin:', err);
        this.toastersService.typeError(this.translate.instant('addAdminPage.toasts.errorTitle'));
      },
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
