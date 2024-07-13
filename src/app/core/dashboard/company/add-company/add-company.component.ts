import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageUploadService } from '../../../../services/ImageUploadService/image-upload.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CompanyService } from '../../../../services/comapnyService/company.service';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class AddCompanyComponent implements OnInit {
  addCompanyForm: FormGroup;
  uploadedImageBase64: string | null = null;
  base64ImageForServer: string | null = null;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private imageUploadService: ImageUploadService,
    private cdr: ChangeDetectorRef
  ) {
    this.addCompanyForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.addCompanyForm = this.fb.group({
      companyNameEn: ['', Validators.required],
      companyNameAr: ['', Validators.required],
      companyField: ['', Validators.required],
      companyCode: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
      phone: ['', Validators.required],
      website: [''],
      facebook: [''],
      twitter: [''],
      instagram: [''],
      linkedin: [''],
      companyPlan: ['', Validators.required] // Ensure companyPlan is required
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imageUploadService.convertFileToBase64(file).then(base64 => {
        this.uploadedImageBase64 = base64; // Keep full base64 for image display
        this.base64ImageForServer = base64.replace(/^data:image\/[a-z]+;base64,/, ''); // Remove metadata for server
        this.cdr.detectChanges(); // Ensure the view updates with the new image
      }).catch(error => {
        console.error('Error converting file to base64', error);
      });
    }
  }

  onSubmit(): void {
    console.log("Form Submitted");
    console.log(this.addCompanyForm);
    if (this.addCompanyForm.valid) {
      console.log("Form is valid");
      this.executeAddFunction();
    } else {
      console.log("Form is invalid");
      this.validateAllFormFields(this.addCompanyForm);
    }
  }

  private executeAddFunction(): void {
    const companyData = {
      ...this.addCompanyForm.value,
      logo: this.base64ImageForServer
    };
    console.log('Submitting company data:', companyData);
    this.companyService.AddCompany(companyData).subscribe(
      response => {
        console.log('Company added successfully', response);
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
}
