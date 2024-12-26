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

@Component({
  selector: 'app-tasks-index',
  standalone: true,
  imports: [ShortenPipe,TranslateModule, RouterLink, RouterLinkActive, DragDropModule, NgIf, NgFor, NgClass, DatePipe,FormsModule],
  templateUrl: './tasks-index.component.html',
  styleUrl: './tasks-index.component.css',
})
export class TasksIndexComponent implements OnInit {
  statuses = ['TODO', 'In Progress', 'Submit For Review', 'Done', 'Archived'];

  tasksByStatus: { [key: string]: Task[] } = {
    TODO: [],
    'In Progress': [],
    'Submit For Review': [],
    Done: [],
    Archived: [],
  };

  connectedLists = this.statuses; // All lists are connected for drag-and-drop

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
      case 'Archived':
        return 'task-group-todo';
      default:
        return '';
    }
  }
  private debounceSearchWithDiscount: (() => void) | any;
  searchText: string = '';
  valueOfSearch: any;
  constructor(
    private tasksService: TasksService,
    private messageService: MessageService
  ) {
    this.debounceSearchWithDiscount = debounce(this.search.bind(this), 500);
  }

  ngOnInit(): void {
    this.loadAllTasks();
  }
  public searcWithDebounce(event: any): void {
    this.debounceSearchWithDiscount(event);
  }
  public search(value: any): void {
    this.valueOfSearch = value.length > 0 ? value.trim() : '';
    console.log(this.valueOfSearch);
    this.loadAllTasks(this.valueOfSearch);
  }

  onDrop(event: CdkDragDrop<Task[]>) {
    console.log('Event:', event);
    // Access the dropped task
    const droppedTask = event.item.data;
    console.log('Dropped Task:', droppedTask);

    const droppedIntoStatus = event.container.id;
    console.log('Dropped Task:', droppedTask);
    console.log('Dropped into Status:', droppedIntoStatus);
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
      case 'Archived':
        newStatus = 5;
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
          console.log('assign task response', response);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: response.message,
          });
        },
        error: (err) => {
          console.error('Error assigning task status:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update task status.',
          });
        },
      });
  }


  loadAllTasks(name?: string): void {
    const companyId = Number(localStorage.getItem('companyId'));
    let query: any = {
      companyId,
      pageSize: 200,
    };
    if (name) {
      query.name = name;
    }
    console.log(query);
    this.tasksService.get(query).subscribe({
      next: (response: any) => {
        console.log(response);
        // Ensure Tasks is an array before iterating
        this.tasksByStatus['TODO'] = [];
        this.tasksByStatus['In Progress'] = [];
        this.tasksByStatus['Done'] = [];
        this.tasksByStatus['Archived'] = [];
        this.tasksByStatus['Submit For Review'] = [];
        for (let item of response['data'].list) {
          if (item.statusId === tasksStatus.Todo) {
            this.tasksByStatus['TODO'].push(item);
            console.log(item);
          } else if (item.statusId == tasksStatus.InProgress) {
            this.tasksByStatus['In Progress'].push(item);
          } else if (item.statusId == tasksStatus.SubmitForReview) {
            this.tasksByStatus['Submit For Review'].push(item);
          } else if (item.statusId == tasksStatus.Done) {
            this.tasksByStatus['Done'].push(item);
          } else if (item.statusId == tasksStatus.Archived) {
            this.tasksByStatus['Archived'].push(item);
          }
        }
      },
      error: (err) => {
        console.error('Error fetching tasks:', err);
      },
    });
  }

}
