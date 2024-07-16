import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../../../services/adminService/admin.service';
import { ImageUploadService } from '../../../../services/ImageUploadService/image-upload.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PasswordValidator } from '../../../../../Modules/passwordValidator';

@Component({
  selector: 'app-add-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.css']
})
export class AddAdminComponent implements OnInit {
  passwordFieldType: string = 'password';
  confirmPasswordFieldType: string = 'password';
  addCompanyForm: FormGroup;
  uploadedImageBase64: string | null = null;
  base64ImageForServer: string | null = null;
  companyId:number=0
  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private imageUploadService: ImageUploadService,
    private router:Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef

  ) {
    this.addCompanyForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.initializeForm();
    this.route.queryParams.subscribe(params => {
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
    if (this.addCompanyForm.valid) {
      this.executeAddFunction();
    } else {
      this.validateAllFormFields(this.addCompanyForm);
    }
  }

  private executeAddFunction(): void {
    const adminData = {
      ...this.addCompanyForm.value,
      logo: this.base64ImageForServer
    };
    adminData.companyId = this.companyId;
    this.adminService.AddAdmin(adminData).subscribe(
      response => {
        console.log('Admin added successfully', response);
        this.addCompanyForm.reset({
          companyId: this.companyId
        });
      },
      error => {
        console.error('Error adding admin', error);
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

  isFieldInvalid(field: string): boolean {
    const control = this.addCompanyForm.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
  }
}
