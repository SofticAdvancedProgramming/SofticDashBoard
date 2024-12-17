import { Component, OnInit } from '@angular/core';
import { LineChartComponent } from '../../components/line-chart/line-chart.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { TasksService } from '../../../../services/TasksService/tasks.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-analytics',
  standalone: true,
  imports: [
    LineChartComponent,
    TranslateModule,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './task-analytics.component.html',
  styleUrl: './task-analytics.component.css'
})
export class TaskAnalyticsComponent implements OnInit {
  id!: number;
  companyId: number;
  taskDetails: any;
  employees: any;
  todoItems: any;
  form!: FormGroup;
  isAssignTaskVisible: boolean = false;
  isTodoStatus: boolean = false;
  todoImgScr!: string;
  inProgressImgScr!: string;
  ReviewImgScr!: string;
  DoneImgScr!: string;
  todoImg: string = '../../../../../assets/images/todo.png';
  inProgressImg: string = '../../../../../assets/images/inprograss.png';
  ReviewImg: string = '../../../../../assets/images/review.png';
  DoneImg: string = '../../../../../assets/images/done.png';
  isInProgressStatus: boolean = false;
  isReviewStatus: boolean = false;
  isDoneStatus: boolean = false;
  taskImg = '../../../../../assets/images/Video Task.png';
  evaluation!:{
    id: number,
    companyId: number,
    qualityScore: number,
    timeScore: number,
    costScore: number,
    evaluationComment: string,
    actualEndDate:string
  }
  qualityScore:number[]=[1,2,3,4,5]
  timeScore:number[]=[1,2,3,4,5]
  constructor(
    private tasksService: TasksService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private translate: TranslateService,
    private toast: ToastrService
  ) {
    this.companyId = Number(localStorage.getItem('companyId'));
  }
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      this.id = params['id'];
      if (id) {
        console.log('Extracted taskId:', id);
      }
    });
    this.isTodoStatus = false;
    this.isInProgressStatus = false;
    this.isReviewStatus = false;
    this.isDoneStatus = false;
    this.todoImgScr = '../../../../../assets/images/notDoneYet.png';
    this.inProgressImgScr = '../../../../../assets/images/notDoneYet.png';
    this.ReviewImgScr = '../../../../../assets/images/notDoneYet.png';
    this.DoneImgScr = '../../../../../assets/images/notDoneYet.png';
    this.getTaksDetails();
    this.getEmployeesAssignments();
    this.getTaskEvaluation();

   // this.generateWeekDays();
  }
  getTaksDetails() {
      let query = {
        companyId: this.companyId,
        id: this.id,
      };
      this.tasksService.get(query).subscribe({
        next: (res) => {
          console.log(res);
          this.taskDetails = res.data.list[0];


          if(this.taskDetails.toDoItems){
            this.todoItems = this.taskDetails.toDoItems;
          }
          if (this.taskDetails.statusId == 1) {
            this.isTodoStatus = true;
            this.todoImgScr = this.todoImg;
          } else if (this.taskDetails.statusId == 2) {
            this.isInProgressStatus = true;
            this.todoImgScr = this.todoImg;
            this.inProgressImgScr = this.inProgressImg;
          } else if (this.taskDetails.statusId == 3) {
            this.isReviewStatus = true;
            this.todoImgScr = this.todoImg;
            this.inProgressImgScr = this.inProgressImg;
            this.ReviewImgScr = this.ReviewImg;
          } else {
            this.isDoneStatus = true;
            this.todoImgScr = this.todoImg;
            this.inProgressImgScr = this.inProgressImg;
            this.ReviewImgScr = this.ReviewImg;
            this.DoneImgScr = this.DoneImg;
          }
          if(this.taskDetails.taskAttachments[0].file){
            this.taskImg = this.taskDetails.taskAttachments[0].file;
          }
        },
        error(err) {
          console.log(err);
        },
      });
    }
  getEmployeesAssignments(){
      let query = {
        companyId: this.companyId,
        taskId: this.id,
      }
      this.tasksService.assignEmployees(query).subscribe({
        next: (res) => {
          console.log(res);
          this.employees = res.data.list;
        },
        error: (err) => {
          console.log(err);
        }
      })
  }
  getTaskEvaluation(){
      this.tasksService.getEvaluation(this.id,{}).subscribe({
        next:(res)=>{console.log(res);
          this.evaluation=res.data;
          this.convertDates();
        },
        error:(res)=>{console.log(res);}
      })
  }

  actualEndDate!:string;
  startDateObject!: { month: number; day: number; year: number;stringMonth:string ;stringDay:string};
  actualEndDateObject!: { month: number; day: number; year: number ;stringMonth:string;stringDay:string};
  endDateObject!: { month: number; day: number; year: number;stringMonth:string ;stringDay:string};
  _8DaysToShowInCalender:{ month: number; day: number; year: number;stringMonth:string ;stringDay:string}[]=[];
   dayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'short' });
   monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'short' });

  convertDates(){
    const date_actualEndDate = new Date(this.evaluation.actualEndDate); // Replace with your Date object
    const date_endDate = new Date(this.taskDetails.endDate);
    const date_startDate = new Date(this.taskDetails.startDate);


    this.startDateObject={
      month:date_startDate.getMonth()+1,
      stringMonth:this.monthFormatter.format(date_startDate),
      day:date_startDate.getDate(),
      stringDay:this.dayFormatter.format(date_startDate),
      year:date_startDate.getFullYear()
    }
    this.endDateObject={
      month:date_endDate.getMonth()+1,
      stringMonth:this.monthFormatter.format(date_endDate),
      day:date_endDate.getDate(),
      stringDay:this.dayFormatter.format(date_endDate),
      year:date_endDate.getFullYear()
    }
    this.actualEndDateObject={
      month:date_actualEndDate.getMonth()+1,
      stringMonth:this.monthFormatter.format(date_actualEndDate),
      day:date_actualEndDate.getDate(),
      stringDay:this.dayFormatter.format(date_actualEndDate),
      year:date_actualEndDate.getFullYear()
    }
    //console.log(this.actualEndDateObject)
    //console.log( this.endDateObject)
    //console.log( this.startDateObject)
    this.generateDay(date_endDate)
  }
  // weekDays: { date: Date; isInRange: boolean }[] = [];
  // startDate: Date = new Date('2022-07-14'); // Example start date
  // endDate: Date = new Date('2022-07-16'); // Example end date
generateDay(startDate:Date){
  for(let i = -1; i < 16; i++){
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i); // Adjust the date
    this._8DaysToShowInCalender.push({
      month:currentDate.getMonth()+1,
      stringMonth:this.monthFormatter.format(currentDate),
      day:currentDate.getDate(),
      stringDay:this.dayFormatter.format(currentDate),
      year:currentDate.getFullYear()
    });
    //console.log(this._8DaysToShowInCalender)
  }


}

  // generateWeekDays() {
  //   // Generate dates for a week (example starting Sunday)
  //   this.startDate= this.taskDetails.startDate
  //   console.log(this.startDate);
  //   this.endDate= this.taskDetails.endDate
  //   console.log(this.endDate);
  //   const startOfWeek = new Date(this.startDate);
  //   startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Go to the previous Sunday

  //   for (let i = 0; i < 7; i++) {
  //     const currentDay = new Date(startOfWeek);
  //     currentDay.setDate(startOfWeek.getDate() + i);

  //     // Check if the current date is within the start and end range
  //     const isInRange = currentDay >= this.startDate && currentDay <= this.endDate;

  //     this.weekDays.push({
  //       date: currentDay,
  //       isInRange: isInRange,
  //     });

  //   }
  //   console.log(this.weekDays);
  // }

}
