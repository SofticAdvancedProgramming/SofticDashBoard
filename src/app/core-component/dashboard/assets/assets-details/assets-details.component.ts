import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignAssetPopupComponent } from "../../../../common-component/assign-asset-popup/assign-asset-popup.component";

@Component({
    selector: 'app-assets-details',
    standalone: true,
    templateUrl: './assets-details.component.html',
    styleUrls: ['./assets-details.component.css'],
    imports: [CommonModule, AssignAssetPopupComponent]
})
export class AssetsDetailsComponent {
  isAssignAssetVisible = false;

  files = [
    { name: 'Laptop Spec Sheet', url: 'assets/files/laptop-spec.pdf' },
    { name: 'User Manual', url: 'assets/files/user-manual.pdf' },
    { name: 'Warranty Information', url: 'assets/files/warranty.pdf' }
  ];

  downloadFile(fileUrl: string) {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  toggleAssignPopup() {
    this.isAssignAssetVisible = !this.isAssignAssetVisible;
  }

  onAssignAssetClose(isVisible: boolean) {
    this.isAssignAssetVisible = isVisible;
  }
}
