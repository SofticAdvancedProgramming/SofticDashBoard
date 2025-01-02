import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { TrackingBarComponent } from '../tracking-bar/tracking-bar.component';
import { IssueExcuterService } from '../../../../services/IssueExcuter/issue-excuter.service';

@Component({
  selector: 'app-progressbar',
  standalone: true,
  imports: [CommonModule,TrackingBarComponent],
  templateUrl: './progressbar.component.html',
  styleUrl: './progressbar.component.css'
})
export class ProgressbarComponent implements OnInit {
  status: { name: string, nameAr: string, id: string, companyId: string }[] = [];


  @Input() complaintDetails: any;
  steps: { label: string, name: string, title: string, status: string }[] = [];
  constructor(private IssueExcuter: IssueExcuterService){

  }

  ngOnInit(): void {
    
    this.IssueExcuter.getAllStatus().subscribe(
      res=>{
        if(res.status===200)
        this.status=res.data.list;
        if(this.complaintDetails.issueTypeId==1){
          this.status=[]
          this.status.push(res.data.list[0])
        }
      }
    )

  }
}
