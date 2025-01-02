import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TasksService } from '../../../../../services/TasksService/tasks.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-move-to-archive-popup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './move-to-archive-popup.component.html',
  styleUrl: './move-to-archive-popup.component.css',
})
export class MoveToArchivePopupComponent implements OnInit {
  @Output() closeArchivePopup = new EventEmitter<boolean>();
  taskId!: number;
  constructor(
    private tasksService: TasksService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.taskId = Number(this.route.snapshot.paramMap.get('id'));
    this.moveToArchive();
  }
  closePopup() {
    this.closeArchivePopup.emit(false);
  }
  moveToArchive() {
    let query = {
      taskId: this.taskId,
      statusId: 5,
    };
    this.tasksService.assignTaskStatus(query).subscribe({
      next: (res) => {
        
      },
      error: (err) => {
        
      },
    });
  }
}
