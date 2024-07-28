import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-add-department',
  standalone: true,
  imports: [],
  templateUrl: './add-department.component.html',
  styleUrl: './add-department.component.css'
})
export class AddDepartmentComponent {
  @Output() action = new EventEmitter<boolean>();

  onSave(): void {
    this.action.emit(false);
  }

  onBack(): void {
    this.action.emit(false);
  }
}
