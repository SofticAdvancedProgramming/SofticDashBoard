import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService,TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-add-assets',
  standalone: true,
  imports: [TranslateModule,CommonModule],
  templateUrl: './add-assets.component.html',
  styleUrl: './add-assets.component.css'
})
export class AddAssetsComponent {
  constructor(
     private translate: TranslateService,
     private route: ActivatedRoute
  ) { }
  selectedFileName: string | null = null;

  imagePreviewUrl: string | ArrayBuffer | null = null;
  fileType: string | null = null;
  uploadMessage: string | null = null;

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fileType = file.type;
      this.selectedFileName = file.name;
      this.readFile(file);
    }
  }

  readFile(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string | null;
      if (result) {
        const base64String = result.split(',')[1];
        this.addAttachment(base64String, file.name);
        this.uploadMessage = this.translate.instant(
          this.fileType?.startsWith('image/') ? 'SENT_REQUESTS.IMAGE_UPLOADED' : 'SENT_REQUESTS.FILE_UPLOADED'
        );
        if (this.fileType?.startsWith('image/')) {
          this.imagePreviewUrl = result;
        }
      }
    };
    reader.readAsDataURL(file);
  }

  addAttachment(base64String: string, fileName: string): void {
    const extension = fileName.split('.').pop();
    // this.AddRequest.requestAttachments.push({
    //   id: 0,
    //   companyId: this.AddRequest.companyId,
    //   file: base64String,
    //   fileExtension: extension || '',
    // });
  }
}
