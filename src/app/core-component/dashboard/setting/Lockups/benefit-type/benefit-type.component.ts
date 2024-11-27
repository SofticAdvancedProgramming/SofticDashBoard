import { Component, OnInit } from '@angular/core';
import { DynamicModalComponent } from '../../../components/dynamic-modal/dynamic-modal.component';
import { ModernTableComponent } from '../../../components/modern-table/modern-table.component';
import { BenefitTypeService } from '../../../../../services/benefitService/benefit-type.service';

@Component({
  selector: 'app-benefit-type',
  standalone: true,
  templateUrl: './benefit-type.component.html',
  styleUrls: ['./benefit-type.component.css'],
  imports: [DynamicModalComponent, ModernTableComponent]
})
export class BenefitTypeComponent implements OnInit {
  benefits: any[] = [];
  columns: string[] = ['id', 'name', 'description', 'amount'];
  deleteId: string = 'deleteBenefit';
  formData: any = {};
  isEdit = false;
  modalId = 'AddBenefit';
  companyId: number = 0;
  structure = [
    { name: 'name', label: 'Benefit Name', type: 'text', required: true },
    { name: 'nameAr', label: 'Benefit Name (Arabic)', type: 'text', required: true }
  ];

  constructor(private benefitService: BenefitTypeService) {
    this.companyId = Number(localStorage.getItem('companyId')) || 0;
  }

  ngOnInit(): void {
    this.loadEntities('Benefit');
  }

  loadEntities(entity: string): void {
    this.benefitService.getBenefits({ companyId: this.companyId }).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.benefits = response.data.list; // Populate benefits
        }
      },
      (error: any) => {
        console.error(`Error fetching ${entity}`, error);
      }
    );
  }

  addEntity(entity: string, newEntity: any): void {
    this.benefitService.addBenefit(newEntity).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.loadEntities(entity); // Reload benefits after adding
        }
      },
      (error: any) => {
        console.error(`Error adding ${entity}`, error);
      }
    );
  }

  editEntity(entity: string, updatedEntity: any): void {
    this.benefitService.editBenefit(updatedEntity).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.loadEntities(entity); // Reload benefits after editing
        }
      },
      (error: any) => {
        console.error(`Error updating ${entity}`, error);
      }
    );
  }

  deleteEntity(entity: string, id: number): void {
    this.benefitService.deleteBenefit(id, this.companyId).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.loadEntities(entity); // Reload benefits after deletion
        }
      },
      (error: any) => {
        console.error(`Error deleting ${entity}`, error);
      }
    );
  }

  handleFormSubmission(data: any): void {
    if (this.isEdit) {
      // Update existing entity
      data.companyId = this.companyId;
      data.id = this.formData.id; // Ensure ID is set if editing
      this.editEntity('Benefit', data);
    } else {
      // Add new entity
      data.id = 0; // Ensure ID is 0 for new entity
      data.companyId = this.companyId; // Set companyId
      this.addEntity('Benefit', data);
    }
  }
  

  openAddModal(): void {
    this.isEdit = false;
    this.formData = { id: 0, companyId: this.companyId, name: '', nameAr: '' }; // Initialize form with empty values
  }
  
  openEditModal(item: any): void {
    this.isEdit = true;
    this.formData = { ...item, companyId: this.companyId }; // Fill the form with the data of the selected item
  }
  
}
