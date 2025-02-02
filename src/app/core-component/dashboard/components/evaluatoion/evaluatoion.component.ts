import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Input() inputTaskId!: number; 
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
    this.taskId = this.inputTaskId; // Set the taskId when the component initializes
    console.log('Received Task ID in Evaluation Component:', this.taskId); // Debugging
    this.initiateForm();
  }

  initiateForm() {
    this.form = this.fb.group({
      cost: ['', Validators.required],
      comment: ['', Validators.required],
    });
  }

  Submit() {
    console.log('Submitting Evaluation for Task ID:', this.taskId); // Debugging
    console.log('Form Data:', this.form.value);

    if (!this.selectedQuality || !this.selectedDuration) {
      this.toast.warning('Please select Quality and Duration');
      return;
    }

    if (this.form.valid && this.taskId) {
      const query = {
        id: this.taskId, // Send taskId as 'id'
        companyId: this.companyId,
        qualityScore: this.selectedQuality,
        timeScore: this.selectedDuration,
        costScore: +this.form.controls['cost'].value,
        evaluationComment: this.form.controls['comment'].value,
      };

      console.log('Final Data Sent:', query); // Debugging

      this.taskService.AssignEvaluation(query).subscribe({
        next: (response) => {
          console.log('API Response:', response); // Debugging
          this.toast.success('Task evaluated successfully');
          this.closePopup();
        },
        error: (err) => {
          console.error('API Error:', err);
          this.toast.error('Failed to submit evaluation');
        },
      });
    } else {
      console.warn('Form Invalid:', this.form.errors); // Debugging
      this.toast.warning('Please fill all required fields');
    }
  }
  
  closePopup() {
    this.closeEvaluationPopup.emit(false);
  }
  selectQuality(value: number): void {
    this.selectedQuality = value;
  }
  
  selectDuration(value: number): void {
    this.selectedDuration = value;
  }
  

  // selectQuality(index: number): void {
  //   this.selectedQuality = this.qualities[index];
  
  // }
}
