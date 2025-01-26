// src/app/components/employee-requests/employee-requests.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { tap, catchError, of } from 'rxjs';
import { MessageService } from 'primeng/api';

import { ReceivedRequest, ReciverRequestSC, RequestStatus } from '../../../../common-component/interfaces/requests';
import { RequestService } from '../../../../services/requestService/request.service';
import { RequestLockupService } from '../../../../services/requestLockupService/request-lockup.service';

@Component({
  selector: 'app-employee-requests',
  standalone: true,
  imports: [
    CommonModule,
    PaginationModule,
    FormsModule,
    TranslateModule,
  ],
  providers: [MessageService],
  templateUrl: './employee-requests.component.html',
  styleUrls: ['./employee-requests.component.css'],
})
export class EmployeeRequestsComponent implements OnInit {
  requests: ReceivedRequest[] = [];
  filteredRequests: ReceivedRequest[] = [];
  requestTypes: any[] = [];
  requestStatuses: any[] = [];
  selectedStatus: RequestStatus | null = null; // Removed ALL option
  public RequestStatus = RequestStatus;
  createdOnFrom: string = '';
  createdOnTo: string = '';
  dateError: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalRequests: number = 0;
  employeeId!: number;

  constructor(
    private requestService: RequestService,
    private requestsService: RequestLockupService,
    private router: Router,
    private translate: TranslateService,
    private messageService: MessageService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    // Get employee ID from the URL
    this.employeeId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.employeeId) {
      console.error('Employee ID not found in URL');
      return;
    }

    // Load the relevant data
    this.loadRequestTypes();
    this.loadRequestStatuses();
    this.loadRequests();
  }

  loadRequests(page: number = this.currentPage): void {
    const requestPayload: Partial<ReciverRequestSC> = {
      employeeId: this.employeeId,
      pageIndex: page,
      pageSize: this.itemsPerPage,

      createdOnFrom: this.createdOnFrom ? new Date(this.createdOnFrom).toISOString() : undefined,
      createdOnTo: this.createdOnTo ? new Date(this.createdOnTo).toISOString() : undefined,
    };


    this.requestService.getRequests(requestPayload).pipe(
      tap((response: any) => {

        if (response.status === 200) {
          this.requests = response.data.list || [];
          this.totalRequests = response.data.totalRows || 0;
          this.filterRequests();
        } else {
          console.error('Unexpected response status:', response.status);
        }
      }),
      catchError((error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load requests.' });
        return of([]);
      })
    ).subscribe();
  }

  handlePageChange(event: { page: number }): void {
    this.currentPage = event.page;
    this.loadRequests(this.currentPage);
  }

  loadRequestTypes(): void {
    this.requestsService.getRequestTypes().pipe(
      tap((response: any) => {
        if (response.status === 200) {
          this.requestTypes = response.data.list || [];
        }

      }),
      catchError((error) => {
        console.error('Error loading request types:', error);
        return of([]);
      })
    ).subscribe();
  }

  loadRequestStatuses(): void {
    this.requestsService.getRequestStatus().pipe(
      tap((response: any) => {
        if (response.status === 200) {
          // Include only Accepted and Rejected statuses
          this.requestStatuses = response.data.list.filter(
            (status: any) => status.id === RequestStatus.Accepted ||
             status.id === RequestStatus.Rejected||
             status.id === RequestStatus.Pending
          );
        }
      }),
      catchError((error) => {
        console.error('Error loading request statuses:', error);
        return of([]);
      })
    ).subscribe();
  }

  getRequestTypeName(id: number): string {
    const type = this.requestTypes.find((rt) => rt.id === id);
    return type ? type.name : this.translate.instant('EMPLOYEE_REQUESTS.UNKNOWN_TYPE');
  }

  getRequestStatusName(id: number): string {
    const status = this.requestStatuses.find((rs) => rs.id === id);

    return status
      ? this.translate.instant(`EMPLOYEE_REQUESTS.REQUEST_STATUSES.${status.name.toUpperCase()}`)
      : this.translate.instant('EMPLOYEE_REQUESTS.UNKNOWN_STATUS');
  }

  filterRequests(): void {
    // First, filter out only Accepted and Rejected requests
    this.filteredRequests = this.requests.filter(
      (request) => request.requestStatusId === RequestStatus.Accepted ||
       request.requestStatusId === RequestStatus.Rejected ||
       request.requestStatusId === RequestStatus.Pending
    );

    // If a specific status is selected, apply additional filtering
    if (this.selectedStatus) {
      this.filteredRequests = this.filteredRequests.filter(
        (request) => request.requestStatusId === this.selectedStatus
      );
    }
  }

  onStatusChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = parseInt(selectElement.value, 10);
    this.selectedStatus = isNaN(selectedValue) ? null : (selectedValue as RequestStatus);
    this.currentPage = 1;
    this.loadRequests(this.currentPage);
  }

  viewTracking(request: ReceivedRequest): void {
    this.router.navigate(['/TrackingRequests'], { queryParams: { requestId: request.id } });
  }

  isArabicLanguage(): boolean {
    return localStorage.getItem('lang') === 'ar';
  }

  deleteRequest(id: number, companyId: number): void {
    this.requestService.deleteRequest(id, companyId).subscribe(
      (response) => {
        if (response.status === 200) {
          this.requests = this.requests.filter((request) => request.id !== id);
          this.filterRequests();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Request deleted successfully.' });
        }
      },
      (error) => {
        console.error('Error deleting request:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete request.' });
      }
    );
  }

  onDateChange(): void {
    this.validateDates();
    if (!this.dateError) {
      this.currentPage = 1;
      this.loadRequests(this.currentPage);
    }
  }

  showDatePicker(event: Event, inputId: string): void {
    event.stopPropagation();
    const inputElement = document.getElementById(inputId) as HTMLInputElement;
    if (inputElement) {
      inputElement.click();
    }
  }

  validateDates(): void {
    if (this.createdOnFrom && this.createdOnTo) {
      const startDate = new Date(this.createdOnFrom);
      const endDate = new Date(this.createdOnTo);

      if (endDate < startDate) {
         this.dateError = this.translate.instant('DATE_ERROR.END_BEFORE_START');
      } else {
        this.dateError = '';
      }
    }
  }
}
