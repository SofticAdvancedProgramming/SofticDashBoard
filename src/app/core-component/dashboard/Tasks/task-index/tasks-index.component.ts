import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Task } from '../../models/Task';
import {
  CdkDragDrop,
  transferArrayItem,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { TasksService } from '../../../../services/TasksService/tasks.service';
import { response } from 'express';
import { MessageService } from 'primeng/api';
import { tasksStatus } from '../../../../core/enums/taskStatus';
import { debounce } from 'lodash';
import { FormsModule } from '@angular/forms';
import { ShortenPipe } from '../../../../core/pipes/shorten.pipe';
import { TasksFilterPopUpComponent } from '../../../../common-component/tasks-filter-pop-up/tasks-filter-pop-up/tasks-filter-pop-up.component';
import { DropDownComponent } from '../../components/drop-down/drop-down.component';
import { RequestTypeService } from '../../../../services/requestTypeService/request-type.service';

@Component({
  selector: 'app-tasks-index',
  standalone: true,
  imports: [
    ShortenPipe,
    TranslateModule,
    RouterLink,
    RouterLinkActive,
    DragDropModule,
    NgIf,
    NgFor,
    NgClass,
    DatePipe,
    FormsModule,
    TasksFilterPopUpComponent,
    DropDownComponent
  ],
  templateUrl: './tasks-index.component.html',
  styleUrl: './tasks-index.component.css',
})
export class TasksIndexComponent implements OnInit {
  statuses = ['TODO', 'In Progress', 'Submit For Review', 'Done'];
  Branches: any[] = [];
  departmentOptions: any[] = [];
  departmentId: any;
  tasksByStatus: { [key: string]: Task[] } = {
    TODO: [],
    'In Progress': [],
    'Submit For Review': [],
    Done: [],
    Archived: [],
  };
  isFilterPopupVisible: boolean = false;
  companyId: number = 0;
  connectedLists = this.statuses; // All lists are connected for drag-and-drop
  branchId: any;

  get connectedStatuses(): string[] {
    return this.statuses;
  }

  getClass(status: string): string {
    // Return a different class based on the status
    switch (status) {
      case 'TODO':
        return 'task-group-todo';
      case 'In Progress':
        return 'task-group-inprograss';
      case 'Submit For Review':
        return 'task-group-submitForReview';
      case 'Done':
        return 'task-group-done';
      default:
        return '';
    }
  }
  private debounceSearchWithDiscount: (() => void) | any;
  searchText: string = '';
  valueOfSearch: any;
  constructor(
    private tasksService: TasksService,
    private messageService: MessageService,
    private requestTypeService: RequestTypeService
    
  ) {
    this.debounceSearchWithDiscount = debounce(this.search.bind(this), 500);
    this.companyId = Number(localStorage.getItem('companyId'));
  }

  ngOnInit(): void {
    this.loadAllTasks();
    this.loadBranchs();
  }
  public searcWithDebounce(event: any): void {
    this.debounceSearchWithDiscount(event);
  }
  public search(value: any): void {
    this.valueOfSearch = value.length > 0 ? value.trim() : '';
   
    this.loadAllTasks(this.valueOfSearch);
  }

  onDrop(event: CdkDragDrop<Task[]>) {
   
    // Access the dropped task
    const droppedTask = event.item.data;
    

    const droppedIntoStatus = event.container.id;
  
    let newStatus: number = 0;
    switch (droppedIntoStatus) {
      case 'TODO':
        newStatus = 1;
        break;
      case 'In Progress':
        newStatus = 2;
        break;
      case 'Submit For Review':
        newStatus = 3;
        break;
      case 'Done':
        newStatus = 4;
        break;
    }

    if (event.previousContainer === event.container) {
      // Reordering within the same list
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      // Moving between lists
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    this.changeTaskStatus(droppedTask.id, newStatus);
  }
  changeTaskStatus(taskId: number, statusId: number) {
    this.tasksService
      .assignTaskStatus({ taskId: taskId, statusId: statusId })
      .subscribe({
        next: (response) => {
        
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: response.message,
          });
        },
        error: (err) => {
        
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update task status.',
          });
        },
      });
  }

  loadAllTasks(name?: string, departmentId? : number): void {
    const companyId = Number(localStorage.getItem('companyId'));
    let query: any = {
      companyId,
      pageSize: 200,
    };
    if (name) {
      query.name = name;
    }
    if(departmentId){
      query.departmentId = departmentId;
    }
    console.log(query);

    this.tasksService.get(query).subscribe({
      next: (response: any) => {
      
        // Ensure Tasks is an array before iterating
        this.tasksByStatus['TODO'] = [];
        this.tasksByStatus['In Progress'] = [];
        this.tasksByStatus['Done'] = [];
        this.tasksByStatus['Submit For Review'] = [];
        for (let item of response['data'].list) {
          if (item.statusId === tasksStatus.Todo) {
            this.tasksByStatus['TODO'].push(item);
            // console.log(item);
          } else if (item.statusId == tasksStatus.InProgress) {
            this.tasksByStatus['In Progress'].push(item);
          } else if (item.statusId == tasksStatus.SubmitForReview) {
            this.tasksByStatus['Submit For Review'].push(item);
          } else if (item.statusId == tasksStatus.Done) {
            this.tasksByStatus['Done'].push(item);
          }
        }
      },
      error: (err) => {
        console.error('Error fetching tasks:', err);
      },
    });
  }
  toggleFilterPopup() {
    this.isFilterPopupVisible = !this.isFilterPopupVisible;
  }
  onFilterPopupClose(isVisible: boolean) {
    this.isFilterPopupVisible = isVisible;
  }
  applyFilterPopup(event: any) {
   

    const taskName = event.name;
    const code: boolean = event.taskCode;
    const taskPriorityId = event.taskPriorityId;
    let query: any = { companyId: this.companyId };
    if (taskName) {
      query = {
        companyId: this.companyId,
        name: taskName.trim(),
      };
    } else if (taskPriorityId) {
      query = {
        companyId: this.companyId,
        taskPriorityId: taskPriorityId,
      };
    } else if (taskName && taskPriorityId) {
      query = {
        companyId: this.companyId,
        name: taskName,
        taskPriorityId: taskPriorityId,
      };
    } else if (code) {
      query = {
        companyId: this.companyId,
        taskCode: code,
      };
    } else if (taskName && taskPriorityId && code) {
      query = {
        companyId: this.companyId,
        name: taskName,
        taskPriorityId: taskPriorityId,
        taskCode: code,
      };
    } else {
      query = { companyId: this.companyId };
    }
    this.tasksService.get(query).subscribe({
      next: (response) => {
        console.log(response);
        // Ensure Tasks is an array before iterating
        this.tasksByStatus['TODO'] = [];
        this.tasksByStatus['In Progress'] = [];
        this.tasksByStatus['Done'] = [];
        this.tasksByStatus['Submit For Review'] = [];
        for (let item of response['data'].list) {
          if (item.statusId === tasksStatus.Todo) {
            this.tasksByStatus['TODO'].push(item);
            // console.log(item);
          } else if (item.statusId == tasksStatus.InProgress) {
            this.tasksByStatus['In Progress'].push(item);
          } else if (item.statusId == tasksStatus.SubmitForReview) {
            this.tasksByStatus['Submit For Review'].push(item);
          } else if (item.statusId == tasksStatus.Done) {
            this.tasksByStatus['Done'].push(item);
          }
        }
      },
      error: (err) => {
       
      },
    });
  }

  loadBranchs(): void {
    this.requestTypeService.getBranches({}).subscribe({
      next: (res) => {
        this.Branches = res.data.list || [];
      },
      error: (err) => console.error(err),
    });
  }
  onBranchSelect(branchId: any): void {
    const branch = this.Branches.find((b) => b.id === branchId);
    if (branch) {
      // this.requestTypeConfigs.at(rowIndex).controls.branchId.setValue(branch.id);
      this.branchId = branch.id;
      this.loadDepartments(branch.id);
    }
  }
  loadDepartments(branchId: number): void {
    this.requestTypeService.getDepartments({ branchId }).subscribe({
      next: (res) => {
        this.departmentOptions = res.data.list || [];
      },
      error: (err) => console.error(err),
    });
  }
  onDepartmentSelect(departmentId: any): void {
    const depArray = this.departmentOptions || [];
    const department = this.departmentOptions.find((d: any) => d.id === departmentId);
    if (department) {
      this.departmentId = department.id;
      this.loadAllTasks('', department.id);
      // this.requestTypeConfigs.at(rowIndex).controls.departmentId.setValue(department.id);
      // this.loadPositions(department.id, rowIndex);
    }
  }
}
