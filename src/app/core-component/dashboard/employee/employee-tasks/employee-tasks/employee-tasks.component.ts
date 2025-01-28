import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CdkDragDrop, transferArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
 import { debounce } from 'lodash';
import { FormsModule } from '@angular/forms';
 import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { Task, TaskAssignment } from '../../../models/Task';
import { TasksService } from '../../../../../services/TasksService/tasks.service';
import { tasksStatus } from '../../../../../core/enums/taskStatus';
import { ShortenPipe } from '../../../../../core/pipes/shorten.pipe';

@Component({
  selector: 'app-employee-tasks',
  standalone: true,
   templateUrl: './employee-tasks.component.html',
  styleUrl: './employee-tasks.component.css',
 imports: [
    TranslateModule,
    RouterLink,
    RouterLinkActive,
    DragDropModule,
    NgIf,
    NgFor,
    NgClass,
     FormsModule,
    DatePipe,
    ShortenPipe,
   ]
})
export class EmployeeTasksComponent {

  statuses: string[] = ['TODO', 'In Progress', 'Submit For Review', 'Done'];
  searchText: string = '';  
  isFilterPopupVisible: boolean = false;
  companyId: number = 0;
  employeeId!: number;
  departmentId!: number;
  private debounceSearchWithDelay: (() => void) | any;
  tasksByStatus: { [key: string]: Task[] } = {
    'TODO': [],
    'In Progress': [],
    'Submit For Review': [],
    'Done': []
  };

  connectedLists: string[] = this.statuses;
  assignedTasks: TaskAssignment[] = [];

  constructor(
    private tasksService: TasksService,
    private messageService: MessageService,
    private router: Router,
    private toast: ToastrService,
    private route: ActivatedRoute
    
  ) { 
    this.debounceSearchWithDelay = debounce(this.performSearch.bind(this), 500);
    this.companyId = Number(localStorage.getItem('companyId'));
     this.departmentId = Number(localStorage.getItem('departmentId'));
  }

  ngOnInit(): void {
    this.employeeId = Number(this.route.snapshot.paramMap.get('id'));
    this.route.queryParams.subscribe((res) => {
    
    });
    this.getAssignedTasks();
  }

  navigateToTaskDetails(taskId: number): void {
    this.router.navigate(['tasksDetails', taskId]);
  }

  search(value: string): void {
    this.searchText = value.trim();
    this.debounceSearchWithDelay();
  }

 
  private performSearch(): void {
    console.log("Searching for:", this.searchText);
    this.getAssignedTasks(this.searchText);  
  }
  onDrop(event: CdkDragDrop<Task[]>): void {
    const droppedTask: Task = event.item.data;
    const droppedIntoStatus = event.container.id;

    console.log(`Dropped task: ${droppedTask.id} into status: ${droppedIntoStatus}`);
  
    console.log("Dropped Task:", droppedTask);
    console.log("Dropped Into Status:", droppedIntoStatus);
  
    if (
      droppedTask.statusId === tasksStatus.Done ||
      droppedTask.statusId === tasksStatus.Archived
    ) {
      
      this.toast.error('This task has been completed or archived and cannot be moved.');
      return;
    }
  
    let roles: any[] = JSON.parse(localStorage.getItem("roles") || "[]");
    const isAdmin = roles.includes('admin');
  
    console.log("Is Admin:", isAdmin);
  
    if (!isAdmin && (droppedIntoStatus === "Done" || droppedIntoStatus === "Archived") && this.employeeId!=droppedTask.createdBy) {
       this.toast.error('You have not permissions to move this task to done or archived');
      return;
    }
  
    const newStatusId = this.getStatusIdFromString(droppedIntoStatus);
    console.log(`New Status ID for ${droppedIntoStatus}:`, newStatusId);
  
    if (event.previousContainer === event.container) {
      console.log("Reordering within the same list");
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      console.log("Moving item between lists");
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  
    console.log("Updating task status...");
    this.changeTaskStatus(droppedTask.id, newStatusId);
  }
  


  changeTaskStatus(taskId: number, statusId: number): void {
    console.log(`Updating Task ${taskId} to Status ID ${statusId}`);

    this.tasksService.assignTaskStatus({ taskId, statusId }).subscribe({
        next: response => {
            console.log("Task status updated:", response);
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Task status updated successfully!'
            });
            this.toast.success('Task status updated successfully!');

            
        },
        error: err => {
            console.error("Failed to update task status:", err);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update task status.'
            });
            this.toast.error('Failed to update task status.');

        }
    });
}


 

  getAssignedTasks(searchText?: string): void {
    const companyId = Number(localStorage.getItem("companyId"));
    const query = {
      companyId,
      employeeId:this.employeeId,
      todoEmployeeId:this.employeeId,
      taskCreatedBy: this.employeeId,
      taskName: searchText || '',
      pageSize: 10000 
    };
    console.log(query);
    this.assignedTasks = []; 
    this.tasksService.GetTaskAssignment(query).subscribe({
      next: (response: any) => {
        console.log(response);
    
        response.data.list.forEach((element: TaskAssignment) => {
          if (!this.assignedTasks.some(task => task.taskId === element.taskId)) {
            this.assignedTasks.push(element);
          }
        });
    
        console.log(this.assignedTasks);
        this.assignTasksToStatus(this.assignedTasks);
      },
      error: (err) => {
        console.error('Error fetching tasks:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load tasks.'
        });
      }
    });

    // this.tasksService.GetTaskAssignment(query).subscribe({
    //   next: (response: any) => {
    //     console.log(response);
    //     this.assignedTasks = response.data.list;
    //     console.log(this.assignedTasks);
    //     this.assignTasksToStatus(response.data.list);
    //   },
    //   error: (err) => {
    //     console.error('Error fetching tasks:', err);
    //     this.messageService.add({
    //       severity: 'error',
    //       summary: 'Error',
    //       detail: 'Failed to load tasks.'
    //     });
    //   }
    // });
  } 

  assignTasksToStatus(taskAssignments: TaskAssignment[]): void {
    this.resetTasksByStatus();

    taskAssignments.forEach((assignment: TaskAssignment) => {
      const task: Task = assignment.task;

      const status = this.getStatusString(task?.statusId ?? tasksStatus.Todo);  // Default to tasksStatus.Todo if statusId is undefined

      if (status) {
        this.tasksByStatus[status]?.push(task);
      } else {
        console.warn(`Unknown statusId: ${task.statusId} for task ID: ${task.id}`);
      }
    });

    console.log('Tasks By Status:', this.tasksByStatus);
  }


  resetTasksByStatus(): void {
    this.statuses.forEach(status => {
      this.tasksByStatus[status] = [];
    });
  }


  getStatusString(statusId: number | undefined): string | null {
    if (statusId === undefined) {
      return 'TODO';
    }

    switch (statusId) {
      case tasksStatus.Todo:
        return 'TODO';
      case tasksStatus.InProgress:
        return 'In Progress';
      case tasksStatus.SubmitForReview:
        return 'Submit For Review';
      case tasksStatus.Done:
        return 'Done';
      case tasksStatus.Archived:
        return 'Archived';
      default:
        return null;
    }
  }

  getStatusIdFromString(status: string): number {
    switch (status) {
      case 'TODO':
        return tasksStatus.Todo;
      case 'In Progress':
        return tasksStatus.InProgress;
      case 'Submit For Review':
        return tasksStatus.SubmitForReview;
      case 'Done':
        return tasksStatus.Done;
      case 'Archived':
        return tasksStatus.Archived;
      default:
        return tasksStatus.Todo;
    }
  }

  getClass(status: string): string {
    switch (status) {
      case "TODO":
        return "task-group-todo";
      case "In Progress":
        return "task-group-inprogress";
      case "Submit For Review":
        return "task-group-submitForReview";
      case "Done":
        return "task-group-done";
      case "Archived":
        return "task-group-archived";
      default:
        return "";
    }
  }

  toggleFilterPopup() {
    this.isFilterPopupVisible = !this.isFilterPopupVisible;
  }
  onFilterPopupClose(isVisible: boolean) {
    this.isFilterPopupVisible = isVisible;
  }
  applyFilterPopup(event: any) {
    console.log('Received Data:', event);

    const taskName = event.name;
    const code: boolean = event.taskCode;
    const taskPriorityId = event.taskPriorityId;
    let query: any = { companyId: this.companyId, employeeId: this.employeeId };
    if (taskName) {
      query.name = taskName.trim();  
    } else if (taskPriorityId) {
      query.taskPriorityId =  taskPriorityId;
    } else if (taskName && taskPriorityId) {
      query.name= taskName;
      query.taskPriorityId= taskPriorityId;
    } else if (code) {
      query.companyId= this.companyId;
      query.taskCode= code;
      
    } else if (taskName && taskPriorityId && code) {
        query.companyId= this.companyId;
        query.name= taskName;
        query.taskPriorityId= taskPriorityId;
        query.taskCode= code;
    } else {
      query = query;
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
        console.log(err);
      },
    });
  }
}
