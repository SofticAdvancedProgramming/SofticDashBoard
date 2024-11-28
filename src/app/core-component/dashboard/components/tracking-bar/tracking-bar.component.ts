import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { IssueExcuterService } from '../../../../services/IssueExcuter/issue-excuter.service';

@Component({
  selector: 'app-tracking-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tracking-bar.component.html',
  styleUrls: ['./tracking-bar.component.css']
})
export class TrackingBarComponent implements OnChanges  {

  @Input() currentStep!: number;
  @Input() steps: { name: string, nameAr: string, id: string, companyId: string }[]=[];
  progressValue!: number; //= 10;

  ngOnChanges(): void {
    this.calculateProgress();
  }
  calculateProgress(): void {
    console.log(this.currentStep)
    // if (this.currentStep === 1) {
    //   this.currentStep = this.steps.findIndex(step => step.name === 'Submitted');
    // }
    // else if (this.currentStep === 2) {
    //   this.currentStep = this.steps.findIndex(step => step.name === 'Opened' );
    // }
    // else if (this.currentStep === 3) {
    //   this.currentStep = this.steps.findIndex(step => step.name === 'In-progress' );
    // }
    // else if (this.currentStep === 4) {
    //   this.currentStep = this.steps.findIndex(step => step.name === 'Waiting' );
    // }
    // else if (this.currentStep === 5) {
    //   this.currentStep = this.steps.findIndex(step => step.name === 'Reopend' );
    // }
    // else if (this.currentStep === 6) {
    //   this.currentStep = this.steps.findIndex(step => step.name === 'closed');
    // }
    // else{
    //   this.currentStep=0
    // }

    //const acceptedSteps = this.steps.filter(step => step.name === 'closed').length;
   // console.log(this.currentStep)
   // this.progressValue = (acceptedSteps / this.steps.length) * 100;
    this.progressValue = ((this.currentStep-.2) / this.steps.length) * 100;
    if(this.currentStep==this.steps.length){
      this.progressValue = ((this.currentStep) / this.steps.length) * 100;
    }

  }

}
