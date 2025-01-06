import { CommonModule } from '@angular/common';
import { Component, input, Input, OnChanges, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-to-do-progress-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './to-do-progress-bar.component.html',
  styleUrl: './to-do-progress-bar.component.css',
})
export class ToDoProgressBarComponent implements OnChanges {
  constructor(private translate: TranslateService) {}

  @Input() currentStep!: number;
  @Input() isFromTask!:boolean;
  @Input() steps: {
    name: string;
    nameAr: string;
    id: string;
    companyId: string;
  }[] = [];
  @Input() progressValue!: number; //= 10;

  ngOnChanges(): void {
    this.calculateProgress();
  }
  calculateProgress(): void {
    
   
    // this.progressValue = ((this.currentStep - 0.2) / this.steps.length) * 100;
    // if (this.currentStep == this.steps.length) {
    //   this.progressValue = (this.currentStep / this.steps.length) * 100;
    // }
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
}
