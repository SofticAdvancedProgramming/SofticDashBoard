import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { MessageService } from 'primeng/api';
import { AuthenticationService } from '../../../services/authenticationService/authentication.service';
import { isPlatformBrowser } from '@angular/common';
import { ToastersService } from '../../../core/services/toast-service/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  providers: [
    JwtHelperService,
    MessageService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    AuthenticationService
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
    private authService: AuthenticationService,
    private cdr: ChangeDetectorRef,
    private toast: ToastersService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void { }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.toast.typeError('Login failed, please try again', 'Invalid Form');
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
            const decodedObject = this.authService.decodeToken(response.data.token);
             localStorage.setItem('companyId', decodedObject.CompanyId),
             localStorage.setItem('userId', decodedObject.nameid);
             localStorage.setItem('firstName', decodedObject.nameid);

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
          this.toast.typeError('Login failed, please try again', 'Invalid Form');
        }
      },
      error: (err: any) => {
        this.isSubmitting = false;
        this.loginForm.reset();
        this.cdr.markForCheck();
      }
    });
  }

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
