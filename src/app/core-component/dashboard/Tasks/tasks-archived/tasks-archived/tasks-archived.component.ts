import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TasksService } from '../../../../../services/TasksService/tasks.service';
import { MessageService } from 'primeng/api';
import { TranslateModule } from '@ngx-translate/core';
import { Task } from '../../../models/Task';
import { tasksStatus } from '../../../../../core/enums/taskStatus';
import { ShortenPipe } from '../../../../../core/pipes/shorten.pipe';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-tasks-archived',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule,ShortenPipe,TranslateModule, RouterLink, RouterLinkActive, DragDropModule, DatePipe],
  templateUrl: './tasks-archived.component.html',
  styleUrl: './tasks-archived.component.css',
})
export class TasksArchivedComponent implements OnInit {
  statuses = ['Archived'];
  
    tasksByStatus: { [key: string]: Task[] } = {
      Archived: [],
    };
    connectedLists = this.statuses; // All lists are connected for drag-and-drop

  get connectedStatuses(): string[] {
    return this.statuses;
  }
  private debounceSearchWithDiscount: (() => void) | any;
  searchText: string = '';
  valueOfSearch: any;
  constructor(
    private tasksService: TasksService,
    private messageService: MessageService
  ) {}
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
        this.tasksByStatus['Archived'] = [];
        for (let item of response['data'].list) {
          if (item.statusId == tasksStatus.Archived) {
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
