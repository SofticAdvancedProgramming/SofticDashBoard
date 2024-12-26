import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TasksService } from '../../../../services/TasksService/tasks.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-evaluatoion',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './evaluatoion.component.html',
  styleUrl: './evaluatoion.component.css',
})
export class EvaluatoionComponent implements OnInit {
  @Output() closeEvaluationPopup = new EventEmitter<boolean>();
  taskId: number = 0;
  form!: FormGroup;
  numbers = [1, 2, 3, 4, 5];
  selectedQuality: number | null = null;
  selectedDuration: number | null = null;
  companyId!: number;
  constructor(private fb: FormBuilder,private taskService:TasksService, private route: ActivatedRoute,private toast: ToastrService) {
    this.companyId = Number(localStorage.getItem('companyId'));
  }
  ngOnInit(): void {
    this.taskId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Task ID:', this.taskId);
    this.initiation();
  }
  initiation() {
    this.form = this.fb.group({
      selectedQuality: [null, Validators.required],
      selectedDuration: [null, Validators.required],
      cost:['', Validators.required],
      comment:['', Validators.required],
    });
  }
  Submit() {
    if (this.form.value && this.taskId) {
      console.log(this.form.value);

      const query = {
        companyId: this.companyId,
        id: this.taskId,
        qualityScore: this.selectedQuality,
        timeScore: this.selectedDuration,
        costScore: +this.form.controls['cost'].value,
        evaluationComment: this.form.controls['comment'].value
      };

      this.taskService.AssignEvaluation(query).subscribe({
        next: (response) => {
          this.toast.success('Task Done successfully');
          // this.onEmployeeSelected.emit(this.selectedEmployee!);
          this.closePopup();
          console.log(response);
        },
        error(err) {
          console.log(err);
        },
      });
    }
  }
  closePopup() {
    this.closeEvaluationPopup.emit(false);
  }

  selectQuality(value: number): void {
    this.selectedQuality = value;
    console.log('Selected Quality:', this.selectedQuality);
  }
  selectDuration(value: number): void {
    this.selectedDuration = value;
    console.log('Selected Duration:', this.selectedDuration);
  }

  // selectQuality(index: number): void {
  //   this.selectedQuality = this.qualities[index];
  //   console.log('Selected Quality:', this.selectedQuality);
  // }
}
