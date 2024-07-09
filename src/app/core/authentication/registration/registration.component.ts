import { Component, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ApiCall } from '../../../services/apiCall/apicall.service';
import { environment } from '../../../environment/environment';
import { user } from '../../../../models/user';
import { PasswordValidator } from '../../../../Modules/passwordValidator';
import { SearchCountryField, CountryISO, NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { CommonModule } from '@angular/common';
import { NoEmailFormatDirective } from '../../../../directives/NoEmailFormatDirective/no-email-format.directive';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
  standalone: true,
  providers: [MessageService],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    NgxIntlTelInputModule, RouterLink , NoEmailFormatDirective
  ],
})
export class RegistrationComponent implements OnInit, OnDestroy {
  registrationForm: FormGroup;
  private subscriptions: Subscription[] = [];
  passwordFieldType: string = 'password';
  confirmPasswordFieldType: string = 'password';
  preferredCountries = [CountryISO.Egypt, CountryISO.SaudiArabia];
  searchCountryFields = [SearchCountryField.Name, SearchCountryField.DialCode, SearchCountryField.Iso2];
  selectedCountryISO = CountryISO.Egypt;
  extension:string='';
  constructor(
    private fb: FormBuilder,
    private apiCall: ApiCall,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: new FormControl('', [Validators.required]),
      password: ['', [Validators.required, PasswordValidator.passwordComplexity()]],
      confirmPassword: ['', Validators.required],
      email: ['', Validators.required],
      userType: [1]
    }, { validators: PasswordValidator.passwordMatch('password', 'confirmPassword') });

  }

  ngOnInit(): void {
    this.extension = this.route.snapshot.paramMap.get('extension') || '';
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());

  }

  onSubmit(): void {
    if (this.registrationForm.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please check your inputs.' });
      return;
    }

    const formValue = this.registrationForm.value;
    const fullName = `${formValue.firstName} ${formValue.lastName}`;
    const phoneNumber = formValue.phoneNumber.e164Number; // Get the full phone number with country code
    const email = formValue.email + this.extension

    const user: user = { ...formValue, fullName, phoneNumber, email };
    user.companyExtention = this.extension;
    console.log('user', user);

    this.apiCall.request<any>(`${environment.apiBaseUrl}Auth/Register`, 'post', user).subscribe({
      next: (response) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Registration Successful' });
console.log(response)
        // Open WhatsApp link to verify user number
        const whatsappLink = response.data.token;
        window.open(whatsappLink, '_blank');
        this.router.navigate(['/otp', { email: email }]);
      },
      error: (err) => {
        const errorMessage = err.error?.errors?.length ? `Error: ${err.error.errors[0]}` : 'Registration failed.';
        this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
      }
    });
  }

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
  }

  // Getters for easy access in the template
  get firstName() { return this.registrationForm.get('firstName'); }
  get lastName() { return this.registrationForm.get('lastName'); }
  get phoneNumber() { return this.registrationForm.get('phoneNumber'); }
  get password() { return this.registrationForm.get('password'); }
  get confirmPassword() { return this.registrationForm.get('confirmPassword'); }
  get companyId() { return this.registrationForm.get('companyId'); }
}
