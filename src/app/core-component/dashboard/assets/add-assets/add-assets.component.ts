import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { LocalStorageService } from '../../../../services/local-storage-service/local-storage.service';
import { AssetsService } from '../../../../services/AssetsService/assets.service';

@Component({
  selector: 'app-add-assets',
  standalone: true,
  imports: [TranslateModule, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './add-assets.component.html',
  styleUrl: './add-assets.component.css',
})
export class AddAssetsComponent implements OnInit {
  form!: FormGroup;
  selectedFileName: string | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = null;
  fileType: string | null = null;
  uploadMessage: string | null = null;
  companyId = this.localStorageService.getItem('companyId');
  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private localStorageService:LocalStorageService,
    private assetsService: AssetsService
  ) {}
  ngOnInit(): void {
    this.initiation();
  }
  initiation(){
    this.form = this.fb.group({
      AssetName: ['', Validators.required],
      AssetID: ['', Validators.required],
      AssetCategory: ['', Validators.required],
      AssetSupCategory: ['', Validators.required],
      AssetReason: ['', Validators.required],
      AssetAccessories: ['', Validators.required],
      AssetLocation: ['', Validators.required],
      AssetAttachment: ['', Validators.required],
      AssetPhoto: ['', Validators.required]
    })
  }

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
          this.fileType?.startsWith('image/')
            ? 'SENT_REQUESTS.IMAGE_UPLOADED'
            : 'SENT_REQUESTS.FILE_UPLOADED'
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

  onSubmit(){
    const params ={

    }

    if(this.form.valid){
      this.assetsService.addAsset(params).subscribe({
        next: (res) => {

        },
        error: (err) => console.log(err)
      })
    }
  }
}
