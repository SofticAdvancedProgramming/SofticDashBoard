
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Task } from '../../models/Task';
import { CdkDragDrop, transferArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { TasksService } from '../../../../services/TasksService/tasks.service';
import { response } from 'express';
import { MessageService } from 'primeng/api';
import { tasksStatus } from '../../../../core/enums/taskStatus';

@Component({
  selector: 'app-tasks-index',
  standalone: true,
  imports: [TranslateModule, RouterLink, RouterLinkActive, DragDropModule, NgIf, NgFor, NgClass, DatePipe],
  templateUrl: './tasks-index.component.html',
  styleUrl: './tasks-index.component.css'
})
export class TasksIndexComponent implements OnInit {
  statuses = ['TODO', 'In Progress', 'Submit For Review', 'Done','Archived'];

  tasksByStatus: { [key: string]: Task[] } = {
    'TODO': [],
    'In Progress': [],
    'Submit For Review': [],
    'Done': [],
    'Archived': []
  };

  connectedLists = this.statuses; // All lists are connected for drag-and-drop

  get connectedStatuses(): string[] {
    return this.statuses;
  }

  getClass(status: string): string {
    // Return a different class based on the status
    switch (status) {
      case "TODO":
        return "task-group-todo";
      case "In Progress":
        return "task-group-inprograss";
      case "Submit For Review":
        return "task-group-submitForReview";
      case "Done":
        return "task-group-done";
      case "Archived":
        return "task-group-todo";
      default:
        return "";
    }
  }



  constructor(private tasksService: TasksService, private messageService: MessageService
  ) {
  }


  ngOnInit(): void {
    this.loadAllTasks();
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
      case "TODO":
        newStatus = 1;
        break;
      case "In Progress":
        newStatus = 2;
        break;
      case "Submit For Review":
        newStatus = 3
        break;
      case "Done":
        newStatus = 4;
        break;
      case "Archived":
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
    this.tasksService.assignTaskStatus({ taskId: taskId, statusId: statusId }).subscribe({
      next: response => {
        console.log("assign task response", response)
        this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });

      }
    })
  }
  search() {

  }

  loadAllTasks(): void {
    const companyId = Number(localStorage.getItem("companyId"));
    this.tasksService.get({ companyId }).subscribe({
      next: (response: any) => {

        // Ensure Tasks is an array before iterating

        for (let item of response["data"].list) {
          if (item.statusId === tasksStatus.TODO) {
            this.tasksByStatus["TODO"].push(item);
          }
          else if (item.statusId == tasksStatus.InProgress) {
            this.tasksByStatus["In Progress"].push(item);
          }
          else if (item.statusId == tasksStatus.SubmitForReview) {
            this.tasksByStatus["Submit For Review"].push(item);
          }
          else if (item.statusId == tasksStatus.Done) {
            this.tasksByStatus["Done"].push(item);
          }
          else if (item.statusId == tasksStatus.Archived) {
            this.tasksByStatus["Archived"].push(item);
          }
        }

      },
      error: (err) => {
        console.error("Error fetching tasks:", err);
      },
    });

  }
}




