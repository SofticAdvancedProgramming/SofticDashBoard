import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TasksService } from '../../../../services/TasksService/tasks.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AssignTaskPopupComponent } from '../../../../common-component/assign-task-popup/assign-task-popup/assign-task-popup.component';
import { tasksStatus } from '../../../../core/enums/taskStatus';
import { ToastrService } from 'ngx-toastr';
import { EvaluatoionComponent } from '../../components/evaluatoion/evaluatoion.component';
import { ReAssignTaskPopupComponent } from '../../components/reAssignTask/re-assign-task-popup/re-assign-task-popup.component';
import { MoveToArchivePopupComponent } from '../../components/moveToArchivePoup/move-to-archive-popup/move-to-archive-popup.component';


@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [
    TranslateModule,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AssignTaskPopupComponent,
    EvaluatoionComponent,
    ReAssignTaskPopupComponent,
    MoveToArchivePopupComponent
  ],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.css',
})
export class TaskDetailsComponent implements OnInit {
  id!: number;
  companyId: number;
  taskDetails: any;
  employees: any;
  todoItems: any;
  form!: FormGroup;
  isAssignTaskVisible: boolean = false;
  isEvaluationVisible: boolean = false;
  isReAssignVisible: boolean = false;
  isArchivedVisible: boolean = false;
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
  isDonePopup: boolean = false;
  taskImg = '../../../../../assets/images/Video Task.png';

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
    this.initiation();
  }

  initiation() {

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
        this.form = this.fb.group({
          laborCost: [this.taskDetails.laborCost, Validators.required],
          materialCost: [this.taskDetails.materialCost, Validators.required],
          serviceCost: [this.taskDetails.serviceCost, Validators.required],
          additionalCost: [this.taskDetails.additionalCost, Validators.required],
        });

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

  search() {}
  onSave() {
    let query = {
      id: this.id,
      companyId: this.companyId,
      laborCost: this.form.controls['laborCost'].value,
      materialCost: this.form.controls['materialCost'].value,
      serviceCost: this.form.controls['serviceCost'].value,
      additionalCost: this.form.controls['additionalCost'].value,
    };
    console.log(query);
    this.tasksService.assignCost(query).subscribe({
      next: (res) => {
        this.toast.success('Updated Successfully');
        console.log(res);
        this.ngOnInit();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  inProgressStaate(){
    let query = {
      taskId: this.id,
      statusId: 2,
    };
    this.tasksService.assignTaskStatus(query).subscribe({
      next: (res) => {
        console.log(res);
        this.ngOnInit();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  submitForReview(){
    let query = {
      taskId: this.id,
      statusId: 3,
    };
    this.tasksService.assignTaskStatus(query).subscribe({
      next: (res) => {
        console.log(res);
        this.ngOnInit();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  reWork() {
    this.isReAssignVisible = true;
    console.log(this.isEvaluationVisible);
    // let query = {
    //   taskId: this.id,
    //   statusId: 2,
    // };
    // this.tasksService.assignTaskStatus(query).subscribe({
    //   next: (res) => {
    //     console.log(res);
    //     this.ngOnInit();
    //   },
    //   error: (err) => {
    //     console.log(err);
    //   },
    // });
  }
  done() {
    this.isEvaluationVisible = true;
    console.log(this.isEvaluationVisible);
    
    // let query = {
    //   taskId: this.id,
    //   statusId: 4,
    // };
    // this.tasksService.assignTaskStatus(query).subscribe({
    //   next: (res) => {
    //     console.log(res);
    //     this.ngOnInit();
    //   },
    //   error: (err) => {
    //     console.log(err);
    //   },
    // });
  }
  moveToArchive() {
    this.isArchivedVisible = true;
    let query = {
      taskId: this.id,
      statusId: 5,
    };
    this.tasksService.assignTaskStatus(query).subscribe({
      next: (res) => {
        console.log(res);
        this.ngOnInit();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  toggleAssignTaskToPopup() {
    this.isAssignTaskVisible = !this.isAssignTaskVisible;
    console.log(this.isAssignTaskVisible);
  }
  onAssignTaskClose(isVisible: boolean) {
    this.isAssignTaskVisible = isVisible;
    this.ngOnInit();
  }
  onReAssignTaskClose(isVisible: boolean) {
    this.isReAssignVisible = isVisible;
    this.ngOnInit();
  }
  onEvaluationClose(isVisible: boolean) {
    this.isEvaluationVisible = isVisible;
    this.ngOnInit();
  }

  onArchivedClose(isVisible: boolean) {
    this.isArchivedVisible = isVisible;
    this.ngOnInit();
  }

  getStatusStyles(status: number) {
    switch (status) {
      case tasksStatus.Todo:
        return 'active-todo';
      case tasksStatus.InProgress:
        return 'active-inprograss';
      case tasksStatus.SubmitForReview:
        return 'active-review';
      case tasksStatus.Done:
        return 'active-done';
      case tasksStatus.Archived:
        return 'task-Archived';
      default:
        return '';
    }
  }

  getTaskStatusName(taskStatusId: number): string {
    switch (taskStatusId) {
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
