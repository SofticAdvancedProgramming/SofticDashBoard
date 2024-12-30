import { Position } from './../../../../../../models/positionModel';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DropDownComponent } from '../../../components/drop-down/drop-down.component';
import { RequestTypeService } from '../../../../../services/requestTypeService/request-type.service';
import { ToastrService } from 'ngx-toastr';
import { pad } from 'lodash';

@Component({
  selector: 'app-request-type-details',
  standalone: true,
  imports:  [
      TranslateModule,
      RouterLink,
      RouterLinkActive,
      ReactiveFormsModule,
      CommonModule,
      FormsModule,
      DropDownComponent,
    ],
  templateUrl: './request-type-details.component.html',
  styleUrl: './request-type-details.component.css'
})
export class RequestTypeDetailsComponent {
  requestId!: number;
  requestTypeDetails: any = null;
  requestTypes: any[] = [];
  isEditMode = false;
  editForm: FormGroup = this.fb.group({
    name: [''],
    nameAr: [''],
    icon: [''],
    max: [0],
    min: [0],
    containAsset: [false],
    // more fields if needed...
  });
    constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private requestTypeService: RequestTypeService,
    private toastr: ToastrService
  ) {

  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.requestId = +params['id'];
      this.loadRequestTypeDetails(this.requestId);
    });
  }
  loadRequestTypeDetails(id: number): void {
    this.requestTypeService.getRequestTypeById(id).subscribe({
      next: (res) => {
        // Suppose res.data.list is an array of request types
        this.requestTypeDetails =
          res.data.list.find((item: any) => item.id === id) || null;
        this.requestTypes = this.requestTypeDetails?.requestTypeConfigs || [];

        // Patch the form with fetched data
        if (this.requestTypeDetails) {
          this.editForm.patchValue({
            name: this.requestTypeDetails.name,
            nameAr: this.requestTypeDetails.nameAr,
            icon: this.requestTypeDetails.icon,
            max: this.requestTypeDetails.max,
            min: this.requestTypeDetails.min,
            containAsset: this.requestTypeDetails.containAsset,
          });
        }

        // optionally update ranks or do any other logic
        this.updateRanks();

        console.log('Request Type Details:', this.requestTypeDetails);
      },
      error: (err) => {
        console.error('Error fetching request type details:', err);
      },
    });
  }

  toggleEdit(): void {
    this.isEditMode = !this.isEditMode;
    // If entering edit mode, ensure form is up to date
    if (this.isEditMode && this.requestTypeDetails) {
      this.editForm.patchValue({
        name: this.requestTypeDetails.name,
        nameAr: this.requestTypeDetails.nameAr,
        icon: this.requestTypeDetails.icon,
        max: this.requestTypeDetails.max,
        min: this.requestTypeDetails.min,
        containAsset: this.requestTypeDetails.containAsset,
      });
    }
  }


  moveUp(index: number): void {
    if (index > 0) {
      let x=this.requestTypes[index-1].positionId;
      this.requestTypes[index-1].positionId = this.requestTypes[index].positionId;
      this.requestTypes[index].positionId = x;


      let y=this.requestTypes[index - 1].positionName;
      this.requestTypes[index - 1].positionName = this.requestTypes[index].positionName;
      this.requestTypes[index].positionName = y;
      // [this.requestTypes[index], this.requestTypes[index - 1]] = [
      //   this.requestTypes[index - 1],
      //   this.requestTypes[index],
      // ];
      this.updateRanks();
    }
  }

  moveDown(index: number): void {
    if (index < this.requestTypes.length - 1) {
      let x=this.requestTypes[index + 1].positionId;
      this.requestTypes[index + 1].positionId = this.requestTypes[index].positionId;
      this.requestTypes[index].positionId = x;


      let y=this.requestTypes[index + 1].positionName;
      this.requestTypes[index + 1].positionName = this.requestTypes[index].positionName;
      this.requestTypes[index].positionName = y;

      // [this.requestTypes[index], this.requestTypes[index + 1]] = [
      //   this.requestTypes[index + 1],
      //   this.requestTypes[index],
      // ];
      this.updateRanks();
    }
  }

  updateRanks(): void {
    this.requestTypes.forEach((config, index) => {
      config.rank = index + 1; // Assign a 1-based rank
    });
  }

  editRequestType(): void {
    const payload = {
      id: this.requestTypeDetails.id,
      companyId: this.requestTypeDetails.companyId,
      name: this.requestTypeDetails.name,
      nameAr: this.requestTypeDetails.nameAr,
     // icon: this.requestTypeDetails.icon,
      maxDays: this.requestTypeDetails.maxDays,
      isCustomized: this.requestTypeDetails.isCustomized,
      requestCategoryId: this.requestTypeDetails.requestCategoryId,
      requestTypeConfigs: this.requestTypes,
    };
console.log(payload,"hhhhhhhhhhhhhhhhhh")
    this.requestTypeService.editRequestType(payload).subscribe({
      next: () => {
        this.toastr.success('Changes saved successfully!');
        console.log('Saved Payload:', payload);
      },
      error: (err) => {
        console.error('Error saving changes:', err);
        this.toastr.error('Failed to save changes.');
      },
    });
  }
  saveChanges(): void {
    // Build the payload according to your new structure
    const payload = {
      id: this.requestTypeDetails.id,
      companyId: this.requestTypeDetails.companyId,
      name: this.editForm.value.name,
      nameAr: this.editForm.value.nameAr,
      icon: this.editForm.value.icon,
      max: this.editForm.value.max,
      min: this.editForm.value.min,
      containAsset: this.editForm.value.containAsset,
      isCustomized: this.requestTypeDetails.isCustomized,
      requestCategoryId: this.requestTypeDetails.requestCategoryId,
      requestTypeConfigs: this.requestTypes.map((config: any) => ({
        id: config.id,
        companyId: config.companyId,
        positionId: config.positionId,
        rank: config.rank,
        requestTypeId: config.requestTypeId,
      })),
    };

    this.requestTypeService.editRequestType(payload).subscribe({
      next: () => {
        this.toastr.success('Changes saved successfully!');
        console.log('Saved Payload:', payload);

        // Optionally refresh the data or go back to read mode
        this.isEditMode = false;
        this.loadRequestTypeDetails(this.requestId);
      },
      error: (err) => {
        console.error('Error saving changes:', err);
        this.toastr.error('Failed to save changes.');
      },
    });
  }
}