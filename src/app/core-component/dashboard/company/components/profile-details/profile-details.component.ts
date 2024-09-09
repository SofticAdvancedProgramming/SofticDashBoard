import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CompanyService } from '../../../../../services/comapnyService/company.service';
import { ImageUploadService } from '../../../../../services/ImageUploadService/image-upload.service';
import { CountryISO, NgxIntlTelInputModule, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { Company } from '../../../../../../models/company';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxIntlTelInputModule, FormsModule, TranslateModule],
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.css']
})
export class ProfileDetailsComponent implements OnInit {
  @Input() company!: Company;
  @Input() cityName: string = '';
  @Input() countryName: string = '';
  uploadedImageBase64: string | null = null;
  base64ImageForServer: string | null = null;
  editMode: boolean = false;
  companyForm!: FormGroup;
  companyId!: number;
  preferredCountries = [CountryISO.Egypt, CountryISO.SaudiArabia];
  searchCountryFields = [SearchCountryField.Name, SearchCountryField.DialCode, SearchCountryField.Iso2];
  selectedCountryISO = CountryISO.Egypt;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private cdr: ChangeDetectorRef,
    private imageUploadService: ImageUploadService,private translate: TranslateService
  ) {}
  get isArabic(): boolean {
    return this.translate.currentLang === 'ar';}
  ngOnInit(): void {
    const companyIdString = localStorage.getItem('companyId');
    if (companyIdString) {
      this.companyId = parseInt(companyIdString, 10);
      this.getCompanyData(this.companyId);
      console.log(this.companyId)
    }

    this.initializeForm();
  }

  toggleEdit(): void {
    this.editMode = !this.editMode;
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const fileExtension = file.name.split('.').pop();

      this.imageUploadService.convertFileToBase64(file).then(base64 => {
        this.uploadedImageBase64 = base64;
        this.base64ImageForServer = base64.replace(/^data:image\/[a-z]+;base64,/, '');
        this.cdr.detectChanges();
      }).catch(error => {
        console.error('Error converting file to base64', error);
      });
    }
  }

  initializeForm(): void {
    this.companyForm = this.fb.group({
      name: [''],
      nameAr: [''],
      email: ['', [ Validators.email]],
      phone: [''],
      phoneNumber: [''],
      address: [''],
      primaryColor: [''],
      secondaryColor: [''],
      fontName: [''],
      webSite: [''],
      facebook: [''],
      twitter: [''],
      instgram: [''],
      tiktok: [''],
      logo:[''],
      description: ['', [ Validators.minLength(100), Validators.maxLength(250)]],
      descriptionAr: ['', [ Validators.minLength(100), Validators.maxLength(250)]]
    });
  }

  getCompanyData(id: number): void {
    const request = { id: id };
    this.companyService.getCompany(request).subscribe(
      (response: any) => {
        console.log('Company data fetched:', response);
        if (response.data && response.data.list && response.data.list.length > 0) {
          const company = response.data.list[0];
          this.populateForm(company);
        }
      },
      error => {
        console.error('Error fetching company data:', error);
      }
    );
  }

  populateForm(company: any): void {
    console.log("Populating form with data:", company);
    this.companyForm.patchValue({
      name: company.name,
      nameAr: company.nameAr,
      email: company.email,
      phone: company.phone,
      phoneNumber: company.phoneNumber,
      address: company.address,
      primaryColor: company.primaryColor,
      secondaryColor: company.secondaryColor,
      fontName: company.fontName,
      webSite: company.webSite,
      facebook: company.facebook,
      twitter: company.twitter,
      instgram: company.instgram,
      tiktok: company.tiktok,
      logo: company.logo,
      description: company.description,
      descriptionAr: company.descriptionAr,
    });
  }

  submitForm(): void {
    console.log("Form Submitted:", this.companyForm.value);

    if (this.companyForm.invalid) {
      console.warn("Form is invalid. Errors:", this.companyForm.errors);
      Object.keys(this.companyForm.controls).forEach(field => {
        const control = this.companyForm.get(field);
        if (control?.invalid) {
          console.log(`Validation error in ${field}:`, control.errors);
        }
      });
      return;
    }

    console.log("Form is valid. Proceeding with the submission.");

    const updatedCompany = {
      ...this.companyForm.value,
      id: this.companyId
    };

    if (this.base64ImageForServer) {
      updatedCompany.logo = this.base64ImageForServer;
    }

    this.companyService.EditCompany(updatedCompany).subscribe(
      response => {
        console.log("Company updated successfully:", response);
        alert('Company details updated successfully');
        this.editMode = false;
      },
      error => {
        console.error('Error updating company details:', error);
      }
    );
  }
  isFieldInvalid(field: string): boolean {
    const control = this.companyForm.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

}


