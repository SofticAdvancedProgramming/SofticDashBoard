import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-assets-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assets-details.component.html',
  styleUrl: './assets-details.component.css'
})
export class AssetsDetailsComponent {
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
}
