import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirmn-delete-dialog',
  standalone: true,
  imports: [],
  templateUrl: './confirmn-delete-dialog.component.html',
  styleUrl: './confirmn-delete-dialog.component.css'
})
export class ConfirmnDeleteDialogComponent {
  @Input() title: string = 'Confirm';
  @Input() message: string = 'Are you sure?';
  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  confirm() {
    this.onConfirm.emit();
  }

  cancel() {
    this.onCancel.emit();
  }
}
