import { Component, OnInit } from '@angular/core';
import { DynamicModalComponent } from '../../../components/dynamic-modal/dynamic-modal.component';
import { ModernTableComponent } from '../../../components/modern-table/modern-table.component';
import { BenefitTypeService } from '../../../../../services/benefitTypeService/benefit-type.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-benefit-type',
  standalone: true,
  templateUrl: './benefit-type.component.html',
  styleUrls: ['./benefit-type.component.css'],
  imports: [DynamicModalComponent, ModernTableComponent,TranslateModule]
})
export class BenefitTypeComponent implements OnInit {
  benefits: any[] = [];
  columns: string[] = ['name', 'nameAr'];
  deleteId: string = 'deleteBenefit';
  formData: any = {};
  isEdit = false;
  modalId = 'AddBenefit';
  companyId: number = 0;
  structure = [
    { name: 'name', label: 'Benefit Name', type: 'text', required: true },
    { name: 'nameAr', label: 'Benefit Name (Arabic)', type: 'text', required: true }
  ];


  constructor(private benefitService: BenefitTypeService,private translate: TranslateService) {
    this.companyId = Number(localStorage.getItem('companyId')) || 0;
  }

  ngOnInit(): void {
    this.loadEntities('Benefit');
  }

  loadEntities(entity: string): void {
    this.benefitService.getBenefitsType({ companyId: this.companyId }).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.benefits = response.data.list;
        }
      },
      (error: any) => {
        console.error(`Error fetching ${entity}`, error);
      }
    );
  }

  addEntity(entity: string, newEntity: any): void {
    this.benefitService.addBenefitType(newEntity).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.loadEntities(entity);
        }
      },
      (error: any) => {
        console.error(`Error adding ${entity}`, error);
      }
    );
  }

  editEntity(entity: string, updatedEntity: any): void {
    this.benefitService.editBenefitType(updatedEntity).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.loadEntities(entity);
        }
      },
      (error: any) => {
        console.error(`Error updating ${entity}`, error);
      }
    );
  }

  deleteEntity(entity: string, id: number): void {
    this.benefitService.deleteBenefitType(id, this.companyId).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.loadEntities(entity);
        }
      },
      (error: any) => {
        console.error(`Error deleting ${entity}`, error);
      }
    );
  }

  handleFormSubmission(data: any): void {
    if (this.isEdit) {
      data.companyId = this.companyId;
      data.id = this.formData.id;
      this.editEntity('Benefit', data);
    } else {
      data.id = 0;
      data.companyId = this.companyId;
      this.addEntity('Benefit', data);
    }
  }


  openAddModal(): void {
    this.isEdit = false;
    this.formData = { id: 0, companyId: this.companyId, name: '', nameAr: '' };
  }

  openEditModal(item: any): void {
    this.isEdit = true;
    this.formData = { ...item, companyId: this.companyId };
  }
}
