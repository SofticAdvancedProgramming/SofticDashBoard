import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthenticationService } from '../../../services/authenticationService/authentication.service';
import { ErrorHandlerService } from '../../../services/ErrorHandlerService/error-handler.service';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule, ToastModule],
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css'],
  providers: [MessageService]
})
export class ForgetPasswordComponent {
  email: string = '';

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService
  ) {}

  onSubmit() {
    if (!this.email) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please enter your email address.' });
      return;
    }

    this.authService.forgetPassword(this.email).subscribe({
      next: (response:any) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Password reset link sent. Please check your email.' });
        const whatsappLink = response.data.token;
        window.open(whatsappLink, '_blank');
        this.router.navigate(['/resetPassword', { email: this.email }]);
      },
      error :(error:any)=> {
        const errorKey = error.error.errors[0];
        const errorMessage = this.errorHandler.getErrorMessage(errorKey); // Pass the error key to getErrorMessage
        this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
        console.error('Error occurred while requesting password reset:', error);
      }
    }

    );
  }
}
