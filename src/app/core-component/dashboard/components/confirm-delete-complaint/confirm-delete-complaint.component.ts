import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-confirm-delete-complaint',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './confirm-delete-complaint.component.html',
  styleUrl: './confirm-delete-complaint.component.css'
})
export class ConfirmDeleteComplaintComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmDeleteComplaintComponent>, private translate: TranslateService)
  {
    
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
