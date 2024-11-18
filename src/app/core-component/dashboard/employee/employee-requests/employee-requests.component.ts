import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { catchError, of, Subject, takeUntil, tap } from 'rxjs';
import { RequestService } from '../../../../services/requestService/request.service';
import { MessageService } from 'primeng/api';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ReceivedRequest, ReciverRequestSC, RequestAction, RequestStatus } from '../../../../common-component/interfaces/requests';
import { RequestLockupService } from '../../../../services/requestLockupService/request-lockup.service';

@Component({
  selector: 'app-employee-requests',
  standalone: true,
  imports: [
    CommonModule,
    PaginationModule,
    FormsModule,
    ToastModule,
    TranslateModule,
  ],
  providers: [MessageService],
  templateUrl: './employee-requests.component.html',
  styleUrl: './employee-requests.component.css',
})
export class EmployeeRequestsComponent implements OnInit, OnDestroy {
  receivedRequest: ReceivedRequest[] = [];
  filteredRequests: ReceivedRequest[] = [];
  requestTypes: any[] = [];
  requestStatuses: any[] = [];
  selectedStatus: RequestStatus = RequestStatus.ALL;
  public RequestStatus = RequestStatus;

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalRequests: number = 0;
  isAdmin: boolean = false;

  private unsubscribe$ = new Subject<void>();
  id: any;
  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService,
    private router: Router,
    private messageService: MessageService,
    private requestsService: RequestLockupService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params) => {
        this.id = params.get('id');
      });
    this.isAdmin = this.checkIfAdmin();
    this.loadRequestTypes();
    this.loadRequestStatuses();
    this.loadRequests();
  }

  checkIfAdmin(): boolean {
    const roles = JSON.parse(localStorage.getItem('roles') || '[]');
    return roles.includes('Admin');
  }

  loadRequests(page: number = this.currentPage): void {
    const requestPayload: Partial<ReciverRequestSC> = {
      receiverId: this.isAdmin ? undefined : parseInt(localStorage.getItem("userId") ?? ""),
      pageIndex: page,
      pageSize: this.itemsPerPage,
      requestStatusId: this.selectedStatus === RequestStatus.ALL ? undefined : this.selectedStatus
    };

    this.requestService.getRequests(ReciverRequestSC).pipe(
      tap((response: any) => {
        if (response.status === 200) {
          this.receivedRequest = response.data.list || [];
          this.filteredRequests = [...this.receivedRequest];
          this.totalRequests = response.data.totalRows;
        }
      }),
      catchError((error) => {
        console.error('Error fetching received requests:', error);
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
          this.requestStatuses = response.data.list || [];
        }
      }),
      catchError((error) => {
        console.error('Error loading request statuses:', error);
        return of([]);
      })
    ).subscribe();
  }

  getRequestTypeName(id: number): string {
    const type = this.requestTypes.find(rt => rt.id === id);
    return type ? type.name : 'Unknown Type';
  }

  getRequestStatusName(id: number): string {
    const status = this.requestStatuses.find(rs => rs.id === id);
    if (status) {
        return `RECEIVED_REQUESTS.REQUEST_STATUSES.${status.name.toUpperCase()}`;  
    }
    return 'RECEIVED_REQUESTS.UNKNOWN_STATUS'; 
}

  filterRequests(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const statusId = parseInt(selectElement.value, 10);
    this.selectedStatus = statusId as RequestStatus;
    this.currentPage = 1;
    this.loadRequests(this.currentPage);
  }

  filterRequestsByStatus(statusId: RequestStatus): void {
    if (statusId === RequestStatus.ALL) {
      this.filteredRequests = this.receivedRequest;
    } else {
      this.filteredRequests = this.receivedRequest.filter(receivedRequest => receivedRequest.requestStatusId === statusId);
    }
  }

  rejectRequest(requestId: number): void {
    let action: RequestAction = {
      id: requestId,
      requestStatusId: RequestStatus.Rejected
    };
    this.requestService.actionReciverRequests(action).pipe(
      tap((res: any) => {
        console.log(res);
        this.updateRequestStatus(requestId, RequestStatus.Rejected);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Request rejected successfully.' });
      }),
      catchError((error) => {
        console.error('Error rejecting request:', error);
        return of([]);
      })
    ).subscribe();
  }

  acceptRequest(requestId: number): void {
    let action: RequestAction = {
      id: requestId,
      requestStatusId: RequestStatus.Accepted
    };
    this.requestService.actionReciverRequests(action).pipe(
      tap((res: any) => {
        console.log(res);
        this.updateRequestStatus(requestId, RequestStatus.Accepted);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Request accepted successfully.' });
      }),
      catchError((error) => {
        console.error('Error accepting request:', error);
        return of([]);
      })
    ).subscribe();
  }

  updateRequestStatus(requestId: number, statusId: RequestStatus): void {
    const request = this.receivedRequest.find(r => r.id === requestId);
    if (request) {
      request.requestStatusId = statusId;
      this.filterRequestsByStatus(this.selectedStatus);
    }
  }

  navigateToDetails(requestId: number): void {
    this.router.navigate(['/RequestDetails', requestId]);
  }
  isArabicLanguage(): boolean {
    return localStorage.getItem('lang') === 'ar';
  }


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
