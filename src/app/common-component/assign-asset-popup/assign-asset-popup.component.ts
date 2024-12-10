import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { employee } from '../../../models/employee';
import { EmployeeService } from '../../services/employeeService/employee.service';
import { AssetsService } from '../../services/AssetsService/assets.service';
import { DropDownComponent } from "../../core-component/dashboard/components/drop-down/drop-down.component";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ImageUploadService } from '../../services/ImageUploadService/image-upload.service';
@Component({
  selector: 'app-assign-asset-popup',
  standalone: true,
  templateUrl: './assign-asset-popup.component.html',
  styleUrls: ['./assign-asset-popup.component.css'],
  imports: [DropDownComponent, CommonModule, FormsModule, TranslateModule, ReactiveFormsModule]
})
export class AssignAssetPopupComponent {
  @Input() assetId: number = 0;
  @Output() closeAssignAssets = new EventEmitter<boolean>();
  @Output() onEmployeeSelected = new EventEmitter<employee>();
  @Input() employees: employee[] = [];
  form!:FormGroup;
  selectedEmployee: employee | null = null;
  loadingMoreEmployees = false;
  employeePage = 1;
  assignDate: string = '';
  attachmentfileType: string | null = null;
  attachmentUploadMessage: string | null = null;
  attachments:any[]=[];
  uploadedImageBase64: any;
  PhotoExtension: any;
  selectedFileName: string | null = null;
  attachmentImagePreviewUrl: string | ArrayBuffer | null = null;
  files: { fileExtension: string; previewUrl: string; file?: string, fileName?:string, fileType?:string }[] = [];
  fileType: string | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = null;
  uploadMessage: string | null = null;

  @Output() onChange = new EventEmitter<employee>();

  constructor(private employeeService: EmployeeService,
    private assetService: AssetsService,
    private route: ActivatedRoute,
    private imageUploadService: ImageUploadService,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) { }
  ngOnInit() {
    this.assetId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Asset ID:', this.assetId);
    this.loadEmployees();
    this.initiation();
  }
  initiation(){
    this.form = this.fb.group({
      assignDate: [],
      AssetPhoto: [],
    })
  }
  closePopup() {
    this.closeAssignAssets.emit(false);
  }
  Submit() {
    if (this.selectedEmployee && this.assignDate && this.assetId) {
      const assignAssetData = {
        assetId: this.assetId,
        employeeId: this.selectedEmployee.id,
        assignDate: this.assignDate,
        assetAttachments: this.attachments
      };

      this.assetService.assignAsset(assignAssetData).subscribe({
        next: (response) => {
          this.onEmployeeSelected.emit(this.selectedEmployee!);
          this.closePopup();
        },

      });
    }
  }


  loadEmployees() {
    if (this.loadingMoreEmployees) return;
    this.loadingMoreEmployees = true;

    this.employeeService.loadEmployees({
      accountStatus: 1,
      pageIndex: this.employeePage,
      pageSize: 10
    }).subscribe({
      next: (response) => {
        const newItems = response.data.list.filter((item: any) => !this.employees.some(a => a.id == item.id))
          .map((employee: any) => ({
            ...employee,
            name: `${employee.firstName} ${employee.lastName}`
          }));

        this.employees = [...this.employees, ...newItems];
        this.employeePage++;
        this.loadingMoreEmployees = false;
      },
      error: (err) => {
        console.error('Error loading employees:', err);
        this.loadingMoreEmployees = false;
      }
    });
  }

  onEmployeeSelect(employeeId: number) {
     const employee = this.employees.find(emp => emp.id === employeeId);
  
    if (employee) {
      console.log('Selected Employee:', employee);  
      this.selectedEmployee = employee;
      console.log('Selected Employee ID:', this.selectedEmployee?.id);  
    } else {
      console.log('Employee not found.');
    }
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


  // onAttachmentChange(event: any): void {
  //   console.log("onAttachmentChange");
    
  //   const file = event.target.files[0];
  //   if (file) {
  //     const attachmentfileType = file.type;
  //     const fileName = file.name;
  
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       const result = reader.result as string | null;
  //       if (result) {
  //         const base64String = result.split(',')[1];
  //         const extension = fileName.split('.').pop();
  //         const fileDetails: { fileExtension: string; previewUrl: string; file?: string, fileName?:string, fileType?:string } = {
  //           fileExtension:extension,
  //           file: base64String,
  //           fileName: fileName,
  //           fileType: attachmentfileType,
  //           previewUrl: result
  //         };
  //         const dataFile:{  fileExtension: string; file: string, id:number, assetId:number } = {
  //            fileExtension: extension, file: base64String , id:0 , assetId:0
  //         }
  //         this.attachments.push(dataFile);
          
  //         // If the file is an image, add a preview URL
  //         if (attachmentfileType.startsWith('image/')) {
  //           this.attachmentImagePreviewUrl = result;
  //           console.log(this.attachmentImagePreviewUrl);
  //         }
  
  //         // Add the file to the array
  //         this.files.push(fileDetails);
  //         console.log(fileDetails);
  //         console.log(this.attachments);
          
  
  //         // Update message
  //         this.attachmentUploadMessage = this.translate.instant(
  //           attachmentfileType.startsWith('image/') ? 'Assets.messages.uploadAnotherImage' : 'Assets.messages.uploadAnotherFile'
  //         );
  //       }
  //     };
  
  //     reader.readAsDataURL(file);
  //   }
  // }
  

}
