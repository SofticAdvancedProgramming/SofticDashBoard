import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TasksService } from '../../../services/TasksService/tasks.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tasks-filter-pop-up',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, TranslateModule,MatSelectModule, MatOptionModule, CommonModule],
  templateUrl: './tasks-filter-pop-up.component.html',
  styleUrl: './tasks-filter-pop-up.component.css'
})
export class TasksFilterPopUpComponent {
  @Output() closeFilterPopup = new EventEmitter<boolean>();
    @Output() confirmFilterPopup = new EventEmitter<any>();
    priorities: any[] = [];
    form!: FormGroup;
    lang = localStorage.getItem('lang');
  
    constructor(private tasksService:TasksService, private fb:FormBuilder){}
    ngOnInit(): void {
      this.getPriorities();
      this.initiation();
    }
    closePopup() {
      this.closeFilterPopup.emit(false);
    }
    initiation(){
      this.form = this.fb.group({
        name: [],
        priority: [],
        code: []
      })
    }
  
    applyFilters() {
      const result = { 
        taskPriorityId: this.form.controls['priority'].value,
        name : this.form.controls['name'].value,
        taskCode : this.form.controls['code'].value
       }
      this.confirmFilterPopup.emit(result)
      this.closePopup();
    }
    getPriorities() {
      this.tasksService.getPriorities({}).subscribe({
        next: (res) => {
          console.log(res);
          this.priorities = res.data.list;
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
}
