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
    ToastModule
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
      phone: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      companyField: ['', Validators.required],
      logo: ['', Validators.required],
      fileExtension: [''],
      primaryColor: ['', Validators.required],
      secondaryColor: ['', Validators.required],
      fontName: ['', Validators.required],
      webSite: [''],
      facebook: [null],
      twitter: [null],
      instgram: [null],
      tiktok: [null],
      cityId: [null],  // Initialize with null
      countryId: [null],  // Initialize with null
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
      this.showError('Invalid Form', 'Please fill all the required fields correctly.');
      this.validateAllFormFields(this.addCompanyForm);
      return;
    }
    this.executeAddFunction();
  }

  private executeAddFunction(): void {
    const companyData = this.addCompanyForm.value;

    console.log(companyData)
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
}
