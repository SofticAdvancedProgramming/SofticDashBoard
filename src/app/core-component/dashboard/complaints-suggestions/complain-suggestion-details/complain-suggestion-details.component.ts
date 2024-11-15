import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { LocalStorageService } from '../../../../services/local-storage-service/local-storage.service';
import { CommonModule } from '@angular/common';
 import { CompliantsAndSuggestionsService } from '../../../../services/ComplaintsSuggestionsService/compliants-and-suggestions.service';
import { EventEmitter, Input, Output } from '@angular/core';
import { IssueExcuterService } from '../../../../services/IssueExcuter/issue-excuter.service';
import { Complaint, ComplaintStatus } from '../../../../../models/complain';

@Component({
  selector: 'app-complain-suggestion-details',
  standalone: true,
  imports: [TranslateModule, CommonModule],
  templateUrl: './complain-suggestion-details.component.html',
  styleUrl: './complain-suggestion-details.component.css'
})
export class ComplainSuggestionDetailsComponent implements OnInit {
  id: number | null = null;
  complaintDetails: any = null;
  loading: boolean = false;
  errorMessage: string | null = null;
  matchedAgainstTypeName: string | null = null;
  againstTypeOptions: any[] = [];
  complaintId: number | null = null;
  issueTypeId: number | null = null;
  @Output() confirm = new EventEmitter<boolean>();


  constructor(
    private translate: TranslateService,
    private router: Router,
    private IssueExcuter: IssueExcuterService,
    private complaintsService: CompliantsAndSuggestionsService,
    private route: ActivatedRoute
  ) { }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = Number(params.get('id'));
      if (this.id) {
        this.loadComplaintDetails();
      }
    });
  }

  loadComplaintDetails(): void {
    if (this.id) {
      this.loading = true;
      this.IssueExcuter.getIssueExcuterById(this.id).subscribe({
        next: (response) => {
          this.complaintDetails = response.data?.list[0] || null;
          this.loading = false;
          this.matchAgainstTypeName();
          console.log('Complaint details loaded:', this.complaintDetails);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Error loading complaint details. Please try again later.';
          console.error('Error fetching complaint details:', error);
        }
      });
    }
  }

  matchAgainstTypeName(): void {
    if (this.complaintDetails && this.complaintDetails.issue.againestTypeId) {
      // Match againstTypeName logic if needed
      this.matchedAgainstTypeName = this.complaintDetails.issue.againestName;
    }
  }
}