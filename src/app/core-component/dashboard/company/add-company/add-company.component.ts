import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageUploadService } from '../../../../services/ImageUploadService/image-upload.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CompanyService } from '../../../../services/comapnyService/company.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SubscriptionPlanService } from '../../../../services/lockupsServices/SubscriptionPlanService/subscription-plan.service';
import { LocationService } from '../../../../services/lockupsServices/LocationService/location.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AlphanumericDirective } from '../../../../common-component/directives/Alphanumeric-directive/alphanumeric-directive.directive';
import { InputRestrictionDirective } from '../../../../common-component/directives/lang-directive/input-restriction.directive';
import { SpecialCharacterDirective } from '../../../../common-component/directives/specialCharacter-directive/special-character.directive';
import { NgxIntlTelInputModule, CountryISO, SearchCountryField, PhoneNumberFormat } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ToastModule,
    AlphanumericDirective,
    InputRestrictionDirective,
    SpecialCharacterDirective,
    NgxIntlTelInputModule
  ],
  providers: [MessageService]
})
export class AddCompanyComponent implements OnInit {
  addCompanyForm: FormGroup;
  uploadedImageBase64: string | null = null;
  base64ImageForServer: string | null = null;
  subscriptionPlans: any[] = [];
  countries: any[] = [];
  cities: any[] = [];
  reasonErrorMessageEn: string | null = null;
  reasonErrorMessageAr: string | null = null;
  preferredCountries = [CountryISO.Egypt, CountryISO.SaudiArabia];
  searchCountryFields = [SearchCountryField.Name, SearchCountryField.DialCode, SearchCountryField.Iso2];
  selectedCountryISO = CountryISO.Egypt;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private imageUploadService: ImageUploadService,
    private subscriptionPlanService: SubscriptionPlanService,
    private locationService: LocationService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService
  ) {
    this.addCompanyForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadSubscriptionPlans();
    this.loadCountries();
  }

  private initializeForm(): void {
    this.addCompanyForm = this.fb.group({
      name: ['', Validators.required],
      nameAr: ['', Validators.required],
      companyExtention: ['', Validators.required],
      description: ['', Validators.required],
      descriptionAr: ['', Validators.required],
      phone: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      companyField: ['', Validators.required],
      logo: ['', Validators.required],
      fileExtension: [''],
      primaryColor: ['', Validators.required],
      secondaryColor: ['', Validators.required],
      fontName: ['', Validators.required],
      webSite:  ['', Validators.required],
      facebook: [null],
      twitter: [null],
      instgram: [null],
      tiktok: [null],
      cityId: [null],
      countryId: [null],
      address: [null],
      subscriptionPlanId: ['', Validators.required]
    });
  }


  private loadSubscriptionPlans(): void {
    this.subscriptionPlanService.getSubscriptionPlan().subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.subscriptionPlans = response.data.list;
        }
      },
      (error: any) => {
        console.error('Error fetching subscription plans', error);
      }
    );
  }

  private loadCountries(): void {
    this.locationService.getCountries().subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.countries = response.data.list;
        }
      },
      (error: any) => {
        console.error('Error fetching countries', error);
      }
    );
  }

  onCountryChange(): void {
    const countryId = this.addCompanyForm.get('countryId')?.value;
    if (countryId) {
      this.loadCities(countryId);
    } else {
      this.cities = [];
    }
  }

  private loadCities(countryId: number): void {
    this.locationService.getCities({ countryId }).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.cities = response.data.list;
        }
      },
      (error: any) => {
        console.error('Error fetching cities', error);
      }
    );
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const fileExtension = file.name.split('.').pop();
      this.addCompanyForm.patchValue({ fileExtension });

      this.imageUploadService.convertFileToBase64(file).then(base64 => {
        this.uploadedImageBase64 = base64;
        this.base64ImageForServer = base64.replace(/^data:image\/[a-z]+;base64,/, '');
        this.addCompanyForm.patchValue({ logo: this.base64ImageForServer });
        this.cdr.detectChanges();
      }).catch(error => {
        console.error('Error converting file to base64', error);
      });
    }
  }

  onSubmit(): void {
    if (this.addCompanyForm.invalid) {
      console.log('Form is invalid:', this.addCompanyForm.errors);
      console.log('Form values:', this.addCompanyForm.value);

      Object.keys(this.addCompanyForm.controls).forEach(key => {
        const controlErrors = this.addCompanyForm.get(key)?.errors;
        if (controlErrors) {
          console.log('Key control: ' + key + ', errors: ', controlErrors);
        }
      });

      this.showError('Invalid Form', 'Please fill all the required fields correctly.');
      this.validateAllFormFields(this.addCompanyForm);
      return;
    }
    this.executeAddFunction();
  }


  private executeAddFunction(): void {
    const companyData = { ...this.addCompanyForm.value };

    companyData.phone = companyData.phone?.e164Number;
    companyData.phoneNumber = companyData.phoneNumber?.e164Number;

    console.log(companyData);

    this.companyService.AddCompany(companyData).subscribe(
      response => {
        this.router.navigate(['../AddAdmin'], { relativeTo: this.route, queryParams: { companyId: response.data.id } });
      },
      error => {
        console.error('Error adding company', error);
      }
    );
  }

  private validateAllFormFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      } else {
        control?.markAsTouched({ onlySelf: true });
        control?.updateValueAndValidity();
      }
    });
  }


  private showError(message: string, details: string): void {
    this.messageService.add({
      severity: 'error',
      summary: message,
      detail: details,
    });
    this.cdr.markForCheck();
  }

  isFieldInvalid(field: string): boolean {
    const control = this.addCompanyForm.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }
  private setupFormListeners(): void {
    this.addCompanyForm.get('description')?.valueChanges.subscribe(() => this.validateField('description'));
    this.addCompanyForm.get('descriptionAr')?.valueChanges.subscribe(() => this.validateField('descriptionAr'));
  }

  private validateField(field: string): void {
    const control = this.addCompanyForm.get(field);
    if (!control) return;

    const valueLength = control.value ? control.value.length : 0;

    if (field === 'description') {
      this.reasonErrorMessageEn = valueLength < 100 ? 'Your message must be at least 100 characters long.' :
                                valueLength > 250 ? 'Your message cannot exceed 250 characters.' : null;
    }

    if (field === 'descriptionAr') {
      this.reasonErrorMessageAr = valueLength < 100 ? 'Your message in Arabic must be at least 100 characters long.' :
                                valueLength > 250 ? 'Your message in Arabic cannot exceed 300 characters.' : null;
    }
  }

}
