import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { LocalStorageService } from '../../../services/local-storage-service/local-storage.service';
import { CompliantsAndSuggestionsService } from '../../../services/ComplaintsSuggestionsService/compliants-and-suggestions.service';
import { IssueService } from '../../../services/issueService/issue.service';
import { Complaint, ComplaintStatus } from '../../../../models/complain';
import { RouterLink, Router } from '@angular/router';
import { IssueExcuterService } from '../../../services/IssueExcuter/issue-excuter.service';
 
@Component({
  selector: 'app-complaints-suggestions',
  standalone: true,
  templateUrl: './complaints-suggestions.component.html',
  styleUrls: ['./complaints-suggestions.component.css'],
  imports: [TranslateModule, CommonModule, RouterLink]
})
export class ComplaintsSuggestionsComponent {
  activeTab: string = 'complaints';
  issueTypeId: number = 1;
  complaints: (Complaint & { againstTypeName?: string })[] = [];
  filteredComplaints: (Complaint & { againstTypeName?: string })[] = [];
  selectedStatus: ComplaintStatus = ComplaintStatus.PENDING;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalComplaints: number = 0;
  public ComplaintStatus = ComplaintStatus;
  userImageUrl: string | null = null;
  userFirstName: string | null = null;
  userSecondName: string | null = null;
  userPosition: string | null = null;
  showDeletePopup: boolean = false;
  deleteId: number | null = null;
  againstTypeOptions: { id: number, name: string }[] = [];
  @Output() confirm = new EventEmitter<boolean>();
  loading: boolean = false;  

  constructor(
    private translate: TranslateService,
    private router: Router,
    private IssueExcuter: IssueExcuterService,
    private localStorageService: LocalStorageService,
    private complaintsService: CompliantsAndSuggestionsService
  ) { }

  selectTab(tab: string) {
    this.activeTab = tab;
    this.issueTypeId = tab === 'complaints' ? 1 : 2;
    this.loadComplaints();
  }
  ngOnInit(): void {
    this.loadAllAgainstType();
    this.loadComplaints();
  }
  loadComplaints(page: number = this.currentPage): void {
    this.loading = true;
    const companyId = Number(this.localStorageService.getItem('companyId'));
    const employeeId = Number(this.localStorageService.getItem('userId'));
    const issueTypeId = this.issueTypeId;

    if (companyId && employeeId) {
      const params = { companyId, issueTypeId, employeeId };
      this.IssueExcuter.getIssueExcuter(params).subscribe({
        next: (response) => {
          this.loading = false;
          if (response && response.data && response.data.list) {
            console.log('API Response:', response); // Log entire response
            this.complaints = response.data.list;
            this.filteredComplaints = this.complaints.map((complaint) => ({
              ...complaint,
              againstTypeName: this.matchAgainstTypeName(complaint.againestTypeId)
            }));
            this.totalComplaints = response.data.totalRows || 0;
          } else {
            console.error('Unexpected response format:', response);
          }
        },
        error: (error) => {
          this.loading = false;
          console.error('Error fetching complaints/suggestions:', error);
        }
      });
    }
  }


  deleteComplaint(id: number, event: Event): void {
    event.stopPropagation();
    this.deleteId = id;
    this.showDeletePopup = true;
  }

  onPopupConfirm(confirm: boolean): void {
    this.showDeletePopup = false;
    if (confirm && this.deleteId !== null) {
      const companyId = Number(this.localStorageService.getItem('companyId'));
      this.IssueExcuter.deleteIssueExcuter(this.deleteId, companyId).subscribe({
        next: () => {
          this.complaints = this.complaints.filter(complaint => complaint.id !== this.deleteId);

        },


      });
      this.deleteId = null;
    }
  }

  navigateToDetails(complaintId: number): void {
    this.router.navigate(['/dashboard/ComplainSuggestionDetails', complaintId]);
  }



  handlePageChange(event: { page: number }): void {
    this.currentPage = event.page;
    this.loadComplaints(this.currentPage);
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = '../../../assets/images/default.jpeg';
  }

  getComplaintStatusName(issueStatusId: number): string {
    switch (issueStatusId) {
      case 1:
        return this.translate.instant('status.submitted');
      case 2:
        return this.translate.instant('status.opened');
      case 3:
        return this.translate.instant('status.in_progress');
      case 4:
        return this.translate.instant('status.closed');
      default:
        return this.translate.instant('status.unknown');
    }
  }

  getStatusClass(issueStatusId: number): string {
    switch (issueStatusId) {
      case 1:
        return 'status-submitted';
      case 2:
        return 'status-opened';
      case 3:
        return 'status-in-progress';
      case 4:
        return 'status-closed';
      default:
        return 'status-unknown';
    }
  }

  loadAllAgainstType(): void {
    this.complaintsService.getAllAgainesType().subscribe({
      next: (response) => {
        this.againstTypeOptions = response.data.list || [];
      },
      error: (error) => console.error('Error loading against types:', error)
    });
  }

  matchAgainstTypeName(againstTypeId: number): string {
    const matchedType = this.againstTypeOptions.find(option => option.id === againstTypeId);
    return matchedType ? matchedType.name : 'Unknown';
  }
}
