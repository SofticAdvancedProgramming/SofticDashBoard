import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { employee } from '../../../models/employee';
import { EmployeeService } from '../../services/employeeService/employee.service';
import { AssetsService } from '../../services/AssetsService/assets.service';
import { DropDownComponent } from '../../core-component/dashboard/components/drop-down/drop-down.component';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RelatedAsset } from '../../../models/assets';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ImageUploadService } from '../../services/ImageUploadService/image-upload.service';
import { LocalStorageService } from '../../services/local-storage-service/local-storage.service';
@Component({
  selector: 'app-related-assets-popup',
  standalone: true,
  templateUrl: './related-assets-popup.component.html',
  styleUrl: './related-assets-popup.component.css',
  imports: [DropDownComponent, CommonModule, FormsModule, TranslateModule],
})
export class RelatedAssetsPopupComponent {
  @Input() assetId: number = 0;
  @Input() employeeId: number = 0;
  @Output() closeRelatedAssets = new EventEmitter<boolean>();
  fileType: string | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = null;
  uploadMessage: string | null = null;
  selectedFileName: string | null = null;
  PhotoExtension: any;
  uploadedImageBase64: any;
  assets: any[] = [];
  lang: string = this.localStorageService.getItem('lang')!;

  childAsset:any;
  relatedAsset: RelatedAsset = {
    companyId: 0,
    name: '',
    nameAr: '',
    model: '',
    assetId: 0,
    photoExtension: '',
    photo: '',
    parentAssetId:0
  };;
  childId:any;
  constructor(
    private assetService: AssetsService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private translate: TranslateService,
    private imageUploadService: ImageUploadService,
    private cdr: ChangeDetectorRef,
    private localStorageService: LocalStorageService

  ) {}
  ngOnInit() {
    const assetIdFromRoute = Number(this.route.snapshot.paramMap.get('id'));
    this.assetId = assetIdFromRoute;
    this.relatedAsset.assetId = this.assetId;
    console.log('Asset ID:', this.assetId);
    this. loadAssets();
    const companyIdFromStorage = localStorage.getItem('companyId');
    if (companyIdFromStorage) {
      this.relatedAsset.companyId = Number(companyIdFromStorage);
    } else {
      console.error('Company ID not found in localStorage');
    }
  }
  loadAssets(){
    this.assetService.getAsset().subscribe({
      next: (res) => {
        this.assets = res.data.list.filter((item:any)=>
        item.parentAssetId==null && item.id!= this.assetId
      )
      },
      error: (err)=>{
        console.log(err)
      }
    })
  }

  closePopup() {
    this.closeRelatedAssets.emit(false);
  }

  Submit() {
    // this.relatedAsset.photoExtension = this.PhotoExtension;
    // this.relatedAsset.photo = this.uploadedImageBase64;
    // this.relatedAsset.parentAssetId=this.assetId
    // console.log(this.relatedAsset);
    // console.log(this.childId);
    this.childAsset.parentAssetId=this.assetId;
    this.childAsset.employeeId=this.employeeId;
    this.edit();
    // if (
    //   this.relatedAsset.name &&
    //   this.relatedAsset.nameAr &&
    //   this.relatedAsset.model &&
    //   this.relatedAsset.photoExtension &&
    //   this.relatedAsset.photo
    // ) {
    //     console.log(this.relatedAsset);
    //   this.assetService.addRelatedAsset(this.relatedAsset).subscribe({
    //     next: (response) => {
    //       console.log('Related asset added:', response);

    //       this.toastr.success('Related asset added successfully');

    //       this.closePopup();
    //     },
    //   });
    // } else {
    //     console.log(this.relatedAsset);
    //   this.toastr.error('All fields are required!');
    // }
  }
  getChild(){
    console.log(this.childId)
    let params={id:this.childId}
    this.assetService.getAsset(params).subscribe(
      (res)=>{
        this.childAsset=res.data.list[0];
       // console.log(this.childAsset)
       // console.log(res)
      },
      (err)=>{console.log(err)}
    )
  }
  edit(){
    console.log(this.childAsset)
    this.assetService.edit(this.childAsset).subscribe({
      next:(res)=>{
      //  console.log(res);
        this.closeRelatedAssets.emit(false);

      },
      error:(res)=>{console.log(res);}
    })
  }
  onFileChange(event: any): void {
    console.log('onFileChange');
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
          //   this.form.patchValue({ photo: this.uploadedImageBase64 });
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
        // this.addAttachment(base64String, file.name);
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
}
