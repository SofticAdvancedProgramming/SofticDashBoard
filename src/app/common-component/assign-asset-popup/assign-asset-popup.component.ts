import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-assign-asset-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assign-asset-popup.component.html',
  styleUrls: ['./assign-asset-popup.component.css']
})
export class AssignAssetPopupComponent {
  @Output() closeAssignAssets = new EventEmitter<boolean>();

  closePopup() {
    this.closeAssignAssets.emit(false);   
  }

  Submit() {
    console.log('Assign an asset to employee applied');
    this.closePopup();  
  }
}
