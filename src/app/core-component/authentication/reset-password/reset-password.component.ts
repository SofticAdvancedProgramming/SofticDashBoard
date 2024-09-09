import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { NgOtpInputModule } from 'ng-otp-input';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { PasswordValidator } from '../../../../Modules/passwordValidator'; // Adjust the path as necessary
import { AuthenticationService } from '../../../services/authenticationService/authentication.service';
import { ErrorHandlerService } from '../../../services/ErrorHandlerService/error-handler.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgOtpInputModule, RouterLink, ToastModule, TranslateModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  providers: [MessageService]
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  otp: string = '';
  email: string = '';
  passwordFieldType: string = 'password';
  confirmPasswordFieldType: string = 'password';

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private errorHandlerService: ErrorHandlerService,
    private translate: TranslateService  // Add TranslateService here
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, PasswordValidator.passwordComplexity()]],
      confirmPassword: ['', Validators.required]
    }, { validators: PasswordValidator.passwordMatch('password', 'confirmPassword') });
  }

  ngOnInit(): void {
    this.email = this.route.snapshot.paramMap.get('email') || '';
  }

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
  }

  onOtpChange(otp: string) {
    this.otp = otp;
  }

  onSubmit(): void {
    if (this.resetPasswordForm.invalid || this.otp.length !== 7) {
      this.messageService.add({
        severity: 'error',
        summary: this.translate.instant('ERROR'),
        detail: this.translate.instant('CHECK_INPUTS')
      });
      return;
    }

    const { password } = this.resetPasswordForm.value;

    this.authService.resetPassword(this.email, password, this.otp).subscribe({
      next: (response: any) => {
        this.messageService.add({
          severity: 'success',
          summary: this.translate.instant('SUCCESS'),
          detail: this.translate.instant('PASSWORD_RESET_SUCCESS')
        });
        this.router.navigate(['/']);
      },
      error: (err: any) => {
        const errorCode = err.error?.code;
        const errorMessage = this.translate.instant(`errorModels.${errorCode}`); // Use localization for error messages
        this.messageService.add({ severity: 'error', summary: this.translate.instant('ERROR'), detail: errorMessage });
      }
    });
  }

  // Getters for easy access in the template
  get password() { return this.resetPasswordForm.get('password'); }
  get confirmPassword() { return this.resetPasswordForm.get('confirmPassword'); }
}
