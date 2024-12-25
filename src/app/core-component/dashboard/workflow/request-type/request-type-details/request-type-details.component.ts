import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DropDownComponent } from '../../../components/drop-down/drop-down.component';
import { RequestTypeService } from '../../../../../services/requestTypeService/request-type.service';

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
    private requestTypeService: RequestTypeService
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
      // Swap the positions
      [this.requestTypes[index], this.requestTypes[index - 1]] = 
        [this.requestTypes[index - 1], this.requestTypes[index]];
  
      // Reassign ranks
      this.updateRanks();
    }
  }
  
  moveDown(index: number): void {
    if (index < this.requestTypes.length - 1) {
      // Swap the positions
      [this.requestTypes[index], this.requestTypes[index + 1]] = 
        [this.requestTypes[index + 1], this.requestTypes[index]];
  
      // Reassign ranks
      this.updateRanks();
    }
  }
  
  updateRanks(): void {
    this.requestTypes.forEach((config, index) => {
      config.rank = index + 1; // Assign a 1-based rank based on the current index
    });
  }
  
}