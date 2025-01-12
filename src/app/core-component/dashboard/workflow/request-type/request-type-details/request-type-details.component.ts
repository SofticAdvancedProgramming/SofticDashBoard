import { Position } from './../../../../../../models/positionModel';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DropDownComponent } from '../../../components/drop-down/drop-down.component';
import { RequestTypeService } from '../../../../../services/requestTypeService/request-type.service';
import { ToastrService } from 'ngx-toastr';
import { pad } from 'lodash';
import { minLessThanMaxValidator } from '../../../../../../validator/minLessThanMaxValidator';

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
  requestCategories: any[] = [];
  requestId!: number;
  requestTypeDetails: any = null;
  requestTypes: any[] = [];
  isEditMode = false;
 
    constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private requestTypeService: RequestTypeService,
    private toastr: ToastrService
  ) {

  }
  editForm: FormGroup = this.fb.group(
    {
      name: [''],
      nameAr: [''],
      icon: [''],
      max: [null, [Validators.required]],
      min: [null, [Validators.required]],
      containAsset: [false],
      requestCategory: [{ value: null, disabled: true }],
    },
    { validators: [minLessThanMaxValidator] }  
  );
  get isMinMaxInvalid(): boolean {
    return this.editForm.errors?.['minGreaterThanMax'] ?? false;
  }
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.requestId = +params['id'];
      this.loadRequestTypeDetails(this.requestId);
    });
    this.loadRequestCategories(); 
  }
  loadRequestCategories(): void {
    this.requestTypeService.getRequestCategory({}).subscribe({
      next: (res) => {
        this.requestCategories = res.data.list || [];
      
      },
      error: (err) => {
      
      },
    });
  }
  
  loadRequestTypeDetails(id: number): void {
    this.requestTypeService.getRequestTypeById(id).subscribe({
      next: (res) => {
        this.requestTypeDetails = res.data.list.find((item: any) => item.id === id) || null;
       
  
        if (this.requestTypeDetails) {
          // Merge name and nameAr with requestTypeConfigs if present
          this.requestTypes = this.requestTypeDetails.requestTypeConfigs.map((config: any) => ({
            ...config,
            name: this.requestTypeDetails.name,
            nameAr: this.requestTypeDetails.nameAr,
          })) || [];
        
  
          this.editForm.patchValue({
            name: this.requestTypeDetails.name,
            nameAr: this.requestTypeDetails.nameAr,
            icon: this.requestTypeDetails.icon,
            max: this.requestTypeDetails.max,
            min: this.requestTypeDetails.min,
            containAsset: this.requestTypeDetails.containAsset,
            requestCategory: this.requestTypeDetails.requestCategoryId,
          });
        }
      },
      error: (err) => {
        console.error('Error fetching request type details:', err);
      },
    });
  }
  
 
  
  onCategoryChange(selectedCategoryId: number): void {
    const selectedCategory = this.requestCategories.find(cat => cat.id === selectedCategoryId);
    if (selectedCategory?.id === 3) {
      this.editForm.patchValue({ containAsset: true });
    } else {
      this.editForm.patchValue({ containAsset: false });
    }
  }
  

  toggleEdit(): void {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode && this.requestTypeDetails) {
      if (this.requestTypeDetails) {
        this.editForm.patchValue({
          name: this.requestTypeDetails.name,
          nameAr: this.requestTypeDetails.nameAr,
          icon: this.requestTypeDetails.icon,
          max: this.requestTypeDetails.max,
          min: this.requestTypeDetails.min,
          containAsset: this.requestTypeDetails.containAsset,
          requestCategory: this.requestTypeDetails.requestCategoryId, 
        });
      }
      
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
      name: this.editForm.value.name,
      nameAr: this.editForm.value.nameAr,
      //icon: this.editForm.value.icon,
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
  
    // API call to save the changes
    this.requestTypeService.editRequestType(payload).subscribe({
      next: () => {
        this.toastr.success('Changes saved successfully!');
       ;
      },
      error: (err) => {
        console.error('Error saving changes:', err);
        this.toastr.error('Failed to save changes.');
      },
    });
  }
  
  saveChanges(): void {
    const payload = {
      id: this.requestTypeDetails.id,
      companyId: this.requestTypeDetails.companyId,
      name: this.editForm.value.name,
      nameAr: this.editForm.value.nameAr,
      icon: this.editForm.value.icon,
      max: this.editForm.value.max,
      min: this.editForm.value.min,
      containAsset: this.editForm.value.containAsset,
      requestCategoryId: this.editForm.value.requestCategory,
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
        this.isEditMode = false;
        this.loadRequestTypeDetails(this.requestId);
      },
      error: (err) => {
        console.error('Error saving changes:', err);
        this.toastr.error('Failed to save changes.');
      },
    });
  }
  get requestCategoryName(): string {
    if (!this.requestCategories.length || !this.requestTypeDetails?.requestCategoryId) {
      return 'N/A';
    }
    const category = this.requestCategories.find(cat => cat.id === this.requestTypeDetails.requestCategoryId);
    return category ? category.name : 'N/A';
  }
}