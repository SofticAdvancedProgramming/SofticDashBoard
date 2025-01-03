import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { CompanyService } from '../../../../../services/comapnyService/company.service';
import { ImageUploadService } from '../../../../../services/ImageUploadService/image-upload.service';
import { SubscriptionPlanService } from '../../../../../services/lockupsServices/SubscriptionPlanService/subscription-plan.service';
import { CountryISO, NgxIntlTelInputModule, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { Company } from '../../../../../../models/company';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CurrencyService } from '../../../../../services/lockupsServices/CurrencyService/currency.service';

@Component({
  selector: 'app-profile-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxIntlTelInputModule, FormsModule, TranslateModule, ToastModule],
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.css']
})
export class ProfileDetailsComponent implements OnInit {
  role: any = JSON.parse(localStorage.getItem('roles')!);
  @Input() company!: Company;
  @Input() cityName: string = '';
  @Input() countryName: string = '';
  uploadedImageBase64: string | null = null;
  base64ImageForServer: string | null = null;
  editMode: boolean = false;
  companyForm!: FormGroup;
  companyId!: number;
  preferredCountries = [CountryISO.SaudiArabia];
  searchCountryFields = [SearchCountryField.All];
  selectedCountryISO = CountryISO.SaudiArabia;
  subscriptionPlanId: number | null = null;
  companyExtention: string | null = null;
  currencies: any;
  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private cdr: ChangeDetectorRef,
    private imageUploadService: ImageUploadService,
    private translate: TranslateService,
    private messageService: MessageService,
    private subscriptionPlanService: SubscriptionPlanService,
    private currenyService:CurrencyService
  ) { }

  get isArabic(): boolean {
    return this.translate.currentLang === 'ar';
  }

  ngOnInit(): void {
    const companyIdString = localStorage.getItem('companyId');
    if (companyIdString) {
      this.companyId = parseInt(companyIdString, 10);
      this.getCompanyData(this.companyId);
      
    }
    this.initializeForm();
    this.loadSubscriptionPlan();
    this.getCurrencies();
  }

  toggleEdit(): void {
    this.editMode = !this.editMode;
  }
  getCurrencies(){
    this.currenyService.getCurrencyTypes().subscribe({
      next: (res) => {
        this.currencies = res.data.list;
      
      },
      error: (err) => console.log(err)
      
    })
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const fileExtension = file.name.split('.').pop();
      this.companyForm.patchValue({ fileExtension });

      this.imageUploadService.convertFileToBase64(file).then(base64 => {
        this.uploadedImageBase64 = base64;
        this.base64ImageForServer = base64.replace(/^data:image\/[a-z]+;base64,/, '');
        this.companyForm.patchValue({ logo: this.base64ImageForServer });
        this.cdr.detectChanges();
      }).catch(error => {
        console.error('Error converting file to base64', error);
      });
    }
  }

  initializeForm(): void {
    const urlRegex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.com$/;
    this.companyForm = this.fb.group({
      name: [''],
      nameAr: [''],
      email: ['', [Validators.email]],
      phone: [''],
      phoneNumber: [''],
      address: [''],
      primaryColor: [''],
      secondaryColor: [''],
      fontName: [''],
      currency: [''],
      webSite: ['', [Validators.pattern(urlRegex)]],
      logo: [''],
      description: ['', [Validators.minLength(5), Validators.maxLength(250)]],
      descriptionAr: ['', [Validators.minLength(5), Validators.maxLength(250)]],
      subscriptionPlanId: [''],
      companyExtention: [''],
      centralizedDepartment: [false] 
    });
  }

  loadSubscriptionPlan(): void {
    this.subscriptionPlanService.getSubscriptionPlan().subscribe(
      (response: any) => {
        if (response.status === 200 && response.data.list.length > 0) {
          this.subscriptionPlanId = response.data.list[0].id;
          this.companyForm.patchValue({ subscriptionPlanId: this.subscriptionPlanId });
        }
      }
    );
  }

  getCompanyData(id: number): void {
    const request = { id: id };
    this.companyService.getCompany(request).subscribe(
      (response: any) => {
        
        if (response.data && response.data.list && response.data.list.length > 0) {
          const company = response.data.list[0];
          this.populateForm(company);
        }
      }
    );
  }



  populateForm(company: any): void {
    this.companyForm.patchValue({
      name: company.name || '',
      nameAr: company.nameAr || '',
      email: company.email || '',
      phone: company.phone || '',
      phoneNumber: company.phoneNumber || '',
      address: company.address || '',
      primaryColor: company.primaryColor || '',
      secondaryColor: company.secondaryColor || '',
      fontName: company.fontName || '',
      webSite: company.webSite || '',
      facebook: company.facebook || '',
      twitter: company.twitter || '',
      instgram: company.instgram || '',
      tiktok: company.tiktok || '',
      logo: company.logo || '',
      currency: company.currency || '',
      description: company.description || '',
      descriptionAr: company.descriptionAr || '',
      subscriptionPlanId: company.subscriptionPlanId || this.subscriptionPlanId,
      companyExtention: company.companyExtention || this.companyExtention,
      centralizedDepartment: company.centralizedDepartment || false
    });
  }

  submitForm(): void {
  
    if (this.companyForm.valid) {
      const updatedCompany: any = {
        ...this.companyForm.value,
        id: this.companyId,
        subscriptionPlanId: this.subscriptionPlanId,
        companyExtention: this.companyExtention || this.companyForm.get('companyExtention')?.value,
        phone: this.companyForm.get('phone')?.value?.e164Number || this.companyForm.get('phone')?.value,
        phoneNumber: this.companyForm.get('phoneNumber')?.value?.e164Number || this.companyForm.get('phoneNumber')?.value,
        centralizedDepartment: this.companyForm.get('centralizedDepartment')?.value // Include centralizedDepartment
      };
      if (!this.base64ImageForServer) {
        delete updatedCompany.logo;
      } else {
        updatedCompany.logo = this.base64ImageForServer;
      }
  
      this.companyService.editCompany(updatedCompany).subscribe(
        response => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Company updated successfully' });
          this.editMode = false;
        },
        error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update company' });
          console.error('Error updating company:', error);
        }
      );
      return;
    }
    this.companyForm.markAllAsTouched();
  }
  


  isFieldInvalid(field: string): boolean {
    const control = this.companyForm.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

}
