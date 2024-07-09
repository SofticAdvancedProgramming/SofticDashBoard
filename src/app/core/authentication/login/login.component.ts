import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthenticationService } from '../../../services/authenticationService/authentication.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, ToastModule , RouterLink],
  providers: [
    JwtHelperService,
    MessageService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
  ],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  private destroy$ = new Subject<void>();
  isSubmitting = false;
  passwordFieldType: string = 'password';
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private authService: AuthenticationService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.showError('Invalid Form', 'Login failed, please try again');
      return;
    }

    const formValue = this.loginForm.value;
    this.isSubmitting = true;

    this.authService.login(formValue.email, formValue.password).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        if (response && response.data.token) {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', response.data.token);
            var decodedObject=this.authService.decodeToken(response.data.token);
            console.log(decodedObject)
            localStorage.setItem('companyId',decodedObject.CompanyId);
          }
          console.log('Token saved. Attempting to navigate to dashboard...');
          this.router.navigate(['/dashboard']).then(success => {
            if (success) {
              console.log('Navigation to dashboard successful');
            } else {
              console.error('Navigation to dashboard failed');
            }
          }).catch(error => {
            console.error('Navigation error:', error);
          });
        } else {
          this.showError('Invalid Form', 'Login failed, please try again');
        }
      },
      error: (err: any) => {
        console.error('Login failed:', err);
        this.isSubmitting = false;
        this.loginForm.reset();
        this.showError('Invalid Form', 'Login failed, please try again');
      }
    });
  }
  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  private showError(message: string, details: string): void {
    this.messageService.add({
      severity: 'error',
      summary: message,
      detail: details,
    });
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
