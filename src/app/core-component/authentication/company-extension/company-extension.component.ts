import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { company } from '../../../../models/company';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CompanyService } from '../../../services/comapnyService/company.service';
import { ErrorHandlerService } from '../../../services/ErrorHandlerService/error-handler.service';

@Component({
  selector: 'app-company-extension',
  standalone: true,
  imports: [RouterLink, ToastModule, ReactiveFormsModule],
  providers: [MessageService],
  templateUrl: './company-extension.component.html',
  styleUrls: ['./company-extension.component.css']
})
export class CompanyExtensionComponent implements OnDestroy {
  getCompanySubscription?: Subscription;
  company?: company;
  companyForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private errorHandlerService: ErrorHandlerService
  ) {
    this.companyForm = this.fb.group({
      companyExtention: ['']
    });
  }

  onSubmit() {
    let companyExtention = this.companyForm.value.companyExtention.toLowerCase();
    this.getCompanySubscription = this.companyService.getCompany({ companyExtention }).subscribe({
      next: (response) => {
        if (response?.data.list.length > 0) {
          console.log(response);
          this.company = response?.data.list[0];
          this.router.navigate(['registration', { extension: this.company?.companyExtention }]);
        } else {
          console.log(response);
          this.messageService.add({
            severity: 'warn', 
            summary: 'No Company Found',
            detail: `We couldn't find any company with the name "${companyExtention}". Please check the name and try again.`,
          });
        }
      },
      error: (err) => {
        const errorCode = err.error?.code; // Assuming the API returns an error code
        const errorMessage = this.errorHandlerService.getErrorMessage(errorCode);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
      }
    });
  }

  ngOnDestroy(): void {
    this.getCompanySubscription?.unsubscribe();
  }
}
