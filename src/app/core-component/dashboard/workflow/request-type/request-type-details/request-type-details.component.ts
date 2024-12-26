import { Position } from './../../../../../../models/positionModel';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup } from '@angular/forms';
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

  constructor(
    private route: ActivatedRoute,
    private requestTypeService: RequestTypeService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.requestId = +params['id'];
      this.loadRequestTypeDetails(this.requestId);
    });
  }

  loadRequestTypeDetails(id: number): void {
    this.requestTypeService.getRequestTypeById(id).subscribe({
      next: (res) => {
        this.requestTypeDetails = res.data.list.find((item: any) => item.id === id) || null;
        this.requestTypes = this.requestTypeDetails?.requestTypeConfigs || [];
        this.updateRanks(); // Ensure ranks are accurate on load
        console.log('Request Type Details:', this.requestTypeDetails);
        console.log('Request Type Configurations:', this.requestTypes);
      },
      error: (err) => {
        console.error('Error fetching request type details:', err);
      },
    });
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
}