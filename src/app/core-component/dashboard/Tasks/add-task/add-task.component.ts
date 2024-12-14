import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { CommonModule } from '@angular/common';
import { TasksService } from '../../../../services/TasksService/tasks.service';


@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [
    TranslateModule,
    RouterLink,
    RouterLinkActive,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css',
})
export class AddTaskComponent implements OnInit {
  companyId!: number;
  form!: FormGroup;
  constructor(private fb: FormBuilder, private tasksService: TasksService) {
    this.companyId = Number(localStorage.getItem('companyId'));
  }
  ngOnInit(): void {
    this.initiation();
  }
  initiation() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      // taskFile: ['', Validators.required],
      taskDetails: [
        '',
        [
          Validators.required,
          Validators.minLength(100),
          Validators.maxLength(300),
        ],
      ],
      from: ['', Validators.required],
      initialCost: ['', Validators.required],
      actualCost: ['', Validators.required],
      duration: ['', Validators.required],
    });
  }

  onSubmit() {
    let query;
    query = {
      companyId: this.companyId,
      name: this.form.controls['name'].value,
      // taskFile: this.form.controls['taskFile'].value,
      description: this.form.controls['taskDetails'].value,
      startDate: this.form.controls['from'].value,
      initialBudget: this.form.controls['initialCost'].value,
      actualCost: this.form.controls['actualCost'].value,
      statusId: 1,
      duration: this.form.controls['duration'].value,
    };
    console.log(this.form.value);
    if (this.form.value) {
      this.tasksService.add(query).subscribe({
        next: (res) => {
          console.log(res);
          this.ngOnInit();
        },
        error(err) {
          console.log(err);
        },
      });
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return control
      ? control.invalid && (control.dirty || control.touched)
      : false;
  }
}
