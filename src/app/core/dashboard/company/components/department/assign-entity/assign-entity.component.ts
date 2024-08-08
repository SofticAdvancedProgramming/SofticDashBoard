import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { employee } from '../../../../../../../models/employee';
import { Department } from '../../../../../../../models/department';
 

@Component({
  selector: 'app-assign-entity',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assign-entity.component.html',
  styleUrls: ['./assign-entity.component.css']
})
export class AssignEntityComponent {
  @Input() entityId?: string;
  @Input() entityType?: string;
  @Input() entities: employee[] = [];
  @Input() department: Department | null = null; // Accept department data
  @Output() close = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<{ entityId: number, relatedEntityId: number }>();

  selectedRelatedEntityId?: string;

  onSubmit() {
    if (this.selectedRelatedEntityId && this.entityId) {
      this.submitForm.emit({
        entityId: Number(this.selectedRelatedEntityId),
        relatedEntityId: Number(this.entityId)
      });
    }
  }
}
