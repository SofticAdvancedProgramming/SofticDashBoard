import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { LocalStorageService } from '../../../../services/local-storage-service/local-storage.service';
import { CommonModule } from '@angular/common';
 import { CompliantsAndSuggestionsService } from '../../../../services/ComplaintsSuggestionsService/compliants-and-suggestions.service';
import { EventEmitter, Input, Output } from '@angular/core';
import { IssueExcuterService } from '../../../../services/IssueExcuter/issue-excuter.service';
import { Complaint, ComplaintStatus } from '../../../../../models/complain';
import { issueStatus } from '../../../../core/enums/IssueStatus';
import { EnumToStringPipe } from '../../../../core/pipes/enum-to-string.pipe';
import { IssueCommentService } from '../../../../services/IssueComment/issue-comment.service';
import { IssueService } from '../../../../services/issueService/issue.service';
import { TrackingBarComponent } from '../../components/tracking-bar/tracking-bar.component';
import { ProgressbarComponent } from '../../components/progressbar/progressbar.component';

declare var bootstrap: any;

@Component({
  selector: 'app-complain-suggestion-details',
  standalone: true,
  imports: [TranslateModule, CommonModule,EnumToStringPipe,ProgressbarComponent],
  templateUrl: './complain-suggestion-details.component.html',
  styleUrl: './complain-suggestion-details.component.css'
})
export class ComplainSuggestionDetailsComponent implements OnInit {
  id: number | null = null;
  issueExecuterId?:number;
  complaintDetails: any = null;
  loading: boolean = false;
  errorMessage: string | null = null;
  matchedAgainstTypeName: string | null = null;
  againstTypeOptions: any[] = [];
  complaintId: number | null = null;
  issueTypeId: number | null = null;
  issueStatus=issueStatus;
  comments:any[]=[];
  @Output() confirm = new EventEmitter<boolean>();
  @ViewChild('comment') comment? :ElementRef;


  constructor(
    private translate: TranslateService,
    private router: Router,
    private IssueExcuter: IssueExcuterService,
    private complaintsService: CompliantsAndSuggestionsService,
    private route: ActivatedRoute,
    private issueCommentService:IssueCommentService,
    private issueService:IssueService
  ) {
    console.log('welcome')
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = Number(params.get('id'));
      if (this.id) {
        this.loadComplaintDetails();
      }
    });


  }

  loadComplaintDetails(): void {
    console.log(this.id);
    if (this.id) {
      this.loading = true;
      this.IssueExcuter.getIssueExcuterById(this.id).subscribe({
        next: (response) => {
        //  console.log("response data inside com",response)
          //console.log("my responsekkkkkkkkkkkkkkkk",response)
          this.complaintDetails = response.data?.list[0].issue || null;
          this.issueExecuterId=response.data?.list[0].id;
          console.log("  this.complaintDetails",  this.complaintDetails)
          this.loading = false;
          this.matchAgainstTypeName();
          //console.log(this.complaintDetails.companyId+' line 73 '+this.complaintDetails.id)
          this.getAllReplays(this.complaintDetails.companyId,this.complaintDetails.id)

        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Error loading complaint details. Please try again later.';
          console.error('Error fetching complaint details:', error);
        }
      });
    }
  }

  openImage(imageUrl: string): void {
    window.open(imageUrl, '_blank');
  }

  matchAgainstTypeName(): void {
    //console.log("this.complaintDetailsthis.complaintDetails",this.complaintDetails)
    if (this.complaintDetails && this.complaintDetails.againestTypeId) {
      // Match againstTypeName logic if needed
      this.matchedAgainstTypeName = this.complaintDetails.againestTypeName;
    }
  }
 
  wait(){
    this.IssueExcuter.getIssueExcuter({id:this.issueExecuterId}).subscribe({
      next: (response) => {
    if (response.data?.list[0].issue.issueStatusId == issueStatus.Progress) {
      //3-Change status
      let executerId= response.data?.list[0].id;
      this.IssueExcuter.performActionOnIssueExcuter(executerId, issueStatus.WaitingForReplay).subscribe({
        next:data=>{
          this.router.navigate(['/dashboard/ComplaintsSuggestions'])
          //console.log(data)
        }
      });
    }
  }
})
}
  submitReply(companyId:number,issueExcuterId:number,issueId:number)
  {
   //console.log("this.complaintDetails",this.complaintDetails)
    this.IssueExcuter.getIssueExcuter({id:this.issueExecuterId}).subscribe({
      next: (response) => {
        //console.log("dataaaaaaaaaa",response)

        if (response.data?.list[0].issue.issueStatusId == issueStatus.Opened || response.data?.list[0].issue.issueStatusId == issueStatus.Reopend) {
          //3-Change status
          let executerId= response.data?.list[0].id;
          this.IssueExcuter.performActionOnIssueExcuter(executerId, issueStatus.Progress).subscribe({
            next:data=>console.log(data)
          });
        }
        if(response.data?.list[0].issue.issueStatusId == issueStatus.Closed){
          this.openModal();
        }
        this.loading = false;
        //console.log('Complaint details loaded:', this.complaintDetails);
      },
      error: (error) => {
        this.loading = false;
       // console.error('Error fetching complaint details:', error);
      }
    });

   // console.log('comment is',)

    //submit comment
    let comment=this.comment?.nativeElement.value;
    this.issueCommentService.addIssueComment(comment,companyId,issueExcuterId,issueId).subscribe({
      next:data=>{
        this.ngOnInit();
       // console.log("comment data",data)
       // this.router.navigate(['/dashboard/ComplaintsSuggestions'])
      }
    })

  }

  getAllReplays(companyId:number,issueId:number){
    this.issueCommentService.getIssueComments(companyId,issueId).subscribe(
      res=>{


        if(res.status==200){
          this.comments=res.data.list;
        }
      }
    )


  }

  getStatusStyles(status: number) {
    switch (status) {
      case issueStatus.Submitted:
        return 'badge-submitted';  // Blue
      case issueStatus.Opened:
        return 'badge-opened';     // Green
      case issueStatus.Progress:
        return 'badge-Progress';// Yellow
      case issueStatus.WaitingForReplay:
        return 'badge-Waiting';// Yellow
      case issueStatus.Reopend:
        return 'badge-Reopend';// Yellow
      case issueStatus.Closed:
        return 'badge-closed';     // Red
      default:
        return '';
    }
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
        return this.translate.instant('status.waiting');
      case 5:
          return this.translate.instant('status.reopen');
      case 6:
          return this.translate.instant('status.closed');
      default:
        return this.translate.instant('status.unknown');
    }
  }

  congrats(){
    this.router.navigate(['/dashboard/ComplaintsSuggestions'])
  }

  openModal() {
    const modalElement = document.getElementById('closeIssue');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }
}
