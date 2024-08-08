import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { employee } from '../../../../../../../models/employee';
import { branch } from '../../../../../../../models/branch';

@Component({
  selector: 'app-assign-entity',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './assign-entity.component.html',
  styleUrls: ['./assign-entity.component.css']
})
export class AssignEntityComponent implements OnInit {
  @Input() entityId?: string;
  @Input() entityType?: string;
  @Input() entities: employee[] = [];
  @Input() branch: branch | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<{ employeeId: number, branchId: number }>();

  assignForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.assignForm = this.fb.group({
      selectedEmployeeId: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.assignForm.valid && this.entityId) {
      this.submitForm.emit({
        employeeId: Number(this.assignForm.value.selectedEmployeeId),
        branchId: Number(this.entityId)
      });
    }
  }

  get selectedEmployeeId() {
    return this.assignForm.get('selectedEmployeeId');
  }
}
