
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Task } from '../../models/Task';
import { CdkDragDrop, transferArrayItem ,moveItemInArray} from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-tasks-index',
  standalone: true,
  imports: [TranslateModule, RouterLink, RouterLinkActive,DragDropModule,NgIf,NgFor,NgClass],
  templateUrl: './tasks-index.component.html',
  styleUrl: './tasks-index.component.css'
})
export class TasksIndexComponent {
  statuses = ['TODO', 'In Progress', 'Submit For Review', 'Done'];

  tasksByStatus :{ [key: string]: Task[] }= {
    'TODO': [
      {
        id: 1,
        title: 'Copywriting of the app',
        description: 'Composing words to provide people with decision-making clarity when interacting with a product.',
        dueDate: '30nov',
        assignees: [
          { avatar: 'assets/images/Avatar (2).png' },
          { avatar: 'assets/images/Avatar (2).png' }
        ]
      }
    ],
    'In Progress': [],
    'Submit For Review': [{
      id: 1,
      title: 'Copywriting of the app',
      description: 'Composing words to provide people with decision-making clarity when interacting with a product.',
      dueDate: '30nov',
      assignees: [
        { avatar: 'assets/images/Avatar (2).png' },
        { avatar: 'assets/images/Avatar (2).png' }
      ]
    }],
    'Done': [{
      id: 1,
      title: 'Copywriting of the app',
      description: 'Composing words to provide people with decision-making clarity when interacting with a product.',
      dueDate: '30nov',
      assignees: [
        { avatar: 'assets/images/Avatar (2).png' },
        { avatar: 'assets/images/Avatar (2).png' }
      ]
    },{
      id: 1,
      title: 'Copywriting of the app',
      description: 'Composing words to provide people with decision-making clarity when interacting with a product.',
      dueDate: '30nov',
      assignees: [
        { avatar: 'assets/images/Avatar (2).png' },
        { avatar: 'assets/images/Avatar (2).png' }
      ]
    }]
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
      default:
        return "";
    }
  }

 

  constructor()
  {
  }

  onDrop(event: CdkDragDrop<Task[]>) {
    console.log('Event:', event);
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
  }
  search(){
  
  }

  loadAllTasks()
  {
    
  }
}




