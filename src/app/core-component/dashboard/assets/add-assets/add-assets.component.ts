import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { LocalStorageService } from '../../../../services/local-storage-service/local-storage.service';
import { AssetsService } from '../../../../services/AssetsService/assets.service';
import { ImageUploadService } from '../../../../services/ImageUploadService/image-upload.service';
import { MapComponent } from '../../../../common-component/map/map.component';

@Component({
  selector: 'app-add-assets',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MapComponent,
  ],
  templateUrl: './add-assets.component.html',
  styleUrl: './add-assets.component.css',
})
export class AddAssetsComponent implements OnInit {
  form!: FormGroup;
  selectedFileName: string | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = null;
  attachmentImagePreviewUrl: string | ArrayBuffer | null = null;
  fileType: string | null = null;
  attachmentfileType: string | null = null;
  uploadMessage: string | null = null;
  attachmentUploadMessage: string | null = null;
  attachments:any[]=[];
  companyId = this.localStorageService.getItem('companyId');
  employeeId = this.localStorageService.getItem('userId');
  uploadedImageBase64: any;
  lang: string = this.localStorageService.getItem('lang')!;
  assetsCategories: any;
  PhotoExtension: any;
  files: { companyId: number; fileExtension: string; previewUrl: string; file?: string, fileName?:string, fileType?:string }[] = [];

  constructor(
    private translate: TranslateService,
    private router: Router,
    private fb: FormBuilder,
    private localStorageService: LocalStorageService,
    private assetsService: AssetsService,
    private imageUploadService: ImageUploadService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.initiation();
    this.getAssetsCategories();
  }
  initiation() {
    this.form = this.fb.group({
      AssetName: ['', Validators.required],
      AssetNameAr: ['', Validators.required],
      Model: ['', Validators.required],
      AssetCategory: ['', Validators.required],
      AssetReason: ['', Validators.required],
      AssetAttachment: ['', Validators.required],
      AssetPhoto: ['', Validators.required],
      long: [0, Validators.required],
      lat: [0, Validators.required],
    });
  }
  getAssetsCategories(name?: string) {
    this.assetsService.getMainAssetsCategory().subscribe({
      next: (res) => {
        this.assetsCategories = res.data.list;
      },
      error: (err) => console.log(err),
    });
  }

  onFileChange(event: any): void {
    console.log("onFileChange");
    const file = event.target.files[0];
    if (file) {
      const fileName = file.name;
      this.PhotoExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
      this.fileType = file.type;
      this.selectedFileName = file.name;
      this.readFile(file);
      this.imageUploadService
        .convertFileToBase64(file)
        .then((base64) => {
          this.uploadedImageBase64 = base64;
          this.uploadedImageBase64 = base64.replace(
            /^data:image\/[a-z]+;base64,/,
            ''
          );
          this.form.patchValue({ photo: this.uploadedImageBase64 });
          this.cdr.detectChanges();
        })
        .catch((error) => {
          console.error('Error converting file to base64', error);
        });
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
            ? 'ASSET_UPLOADER.IMAGE_UPLOADED'
            : 'ASSET_UPLOADER.FILE_UPLOADED'
        );
        if (this.fileType?.startsWith('image/')) {
          this.imagePreviewUrl = result;
          console.log(this.imagePreviewUrl);
          
        }
      }
    };
    reader.readAsDataURL(file);
  }


  onAttachmentChange(event: any): void {
    console.log("onAttachmentChange");
    
    const file = event.target.files[0];
    if (file) {
      const attachmentfileType = file.type;
      const fileName = file.name;
  
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string | null;
        if (result) {
          const base64String = result.split(',')[1];
          const companyId = Number(this.localStorageService.getItem('companyId'));
          const extension = fileName.split('.').pop();
          const fileDetails: { companyId: number; fileExtension: string; previewUrl: string; file?: string, fileName?:string, fileType?:string } = {
            companyId: companyId,
            fileExtension:extension,
            file: base64String,
            fileName: fileName,
            fileType: attachmentfileType,
            previewUrl: result
          };
          const dataFile:{ companyId: number; fileExtension: string; file: string, id:number, assetId:number } = {
            companyId: companyId, fileExtension: extension, file: base64String , id:0 , assetId:0
          }
          this.attachments.push(dataFile);
          
          // If the file is an image, add a preview URL
          if (attachmentfileType.startsWith('image/')) {
            this.attachmentImagePreviewUrl = result;
            console.log(this.attachmentImagePreviewUrl);
          }
  
          // Add the file to the array
          this.files.push(fileDetails);
          console.log(fileDetails);
          console.log(this.attachments);
          
  
          // Update message
          this.attachmentUploadMessage = this.translate.instant(
            attachmentfileType.startsWith('image/') ? 'Assets.messages.uploadAnotherImage' : 'Assets.messages.uploadAnotherFile'
          );
        }
      };
  
      reader.readAsDataURL(file);
    }
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
  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  onSubmit() {
    const params = {
      companyId: Number(this.companyId),
      name: this.form.value.AssetName,
      nameAr: this.form.value.AssetNameAr,
      model: this.form.controls['Model'].value,
      assetCategoryId: Number(this.form.controls['AssetCategory'].value),
      photo: this.uploadedImageBase64,
      photoExtension: this.PhotoExtension,
      long: this.form.controls['long'].value,
      lat: this.form.controls['lat'].value,
      assetAttachments: this.attachments
    };
    this.assetsService.addAsset(params).subscribe({
      next: (res) => {
        this.router.navigateByUrl('/dashboard/AssetsIndex');
      },
      error: (err) => console.log(err),
    });
  }

  onLocationSelected(location: { lat: number; lng: number }): void {
    this.form.patchValue({ lat: location.lat, long: location.lng });
  }
}