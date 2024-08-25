import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgOtpInputModule } from 'ng-otp-input';
import { environment } from '../../../environment/environment';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ApiCall } from '../../../core/services/http-service/HttpService';

@Component({
  selector: 'app-otp',
  standalone: true,
  providers: [MessageService],
  imports: [RouterLink, NgOtpInputModule, ToastModule],
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OtpComponent implements OnInit {
  otp: string = '';
  email?: string;
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private apiCall = inject(ApiCall);
  private messageService = inject(MessageService);

  ngOnInit(): void {
    this.email = this.route.snapshot.paramMap.get('email') || '';
  }

  onSubmit(): void {
    console.log(this.otp);
    this.apiCall.request(`${environment.apiBaseUrl}Auth/VerfiyEmail`, 'post', { email: this.email, otp: this.otp }).subscribe({
      next: (response) => {
        console.log('Response:', response);
        if (response?.status === 200 && response?.data?.isAuth) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'OTP verified successfully' });
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1500);

        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: response?.data?.message || 'Verification failed' });
        }
      },
      error: (err) => {
        const errorMessage = err.error?.errors?.length ? `Error: ${err.error.errors[0]}` : 'Verification failed.';
        this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
      }
    });
  }

  onOtpChange(otp: string) {
    this.otp = otp;
  }
}
