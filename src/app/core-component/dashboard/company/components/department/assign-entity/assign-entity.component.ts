import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { employee } from '../../../../../../../models/employee';
import { TranslateModule, TranslateService } from '@ngx-translate/core'; // Import TranslateModule

@Component({
  selector: 'app-assign-entity',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule], // Add TranslateModule here
  templateUrl: './assign-entity.component.html',
  styleUrls: ['./assign-entity.component.css']
})
export class AssignEntityComponent implements OnInit {
  @Input() entityId?: string;
  @Input() entityType?: string;
  @Input() entities: employee[] = [];
  @Input() department: any | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<{ entityId: number; relatedEntityId: number }>();

  assignForm: FormGroup;

  constructor(private fb: FormBuilder, private translate: TranslateService) {
    this.assignForm = this.fb.group({
      selectedRelatedEntityId: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.assignForm.valid && this.entityId) {
      this.submitForm.emit({
        entityId: Number(this.assignForm.value.selectedRelatedEntityId),
        relatedEntityId: Number(this.entityId)
      });
    }
  }

  get selectedRelatedEntityId() {
    return this.assignForm.get('selectedRelatedEntityId');
  }
}
