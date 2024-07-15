import { Component, OnInit } from '@angular/core';
import { SubscriptionPlanService } from '../../../../../services/lockupsServices/SubscriptionPlanService/subscription-plan.service';
import { DynamicModalComponent } from '../../../components/dynamic-modal/dynamic-modal.component';
import { ModernTableComponent } from '../../../components/modern-table/modern-table.component';

@Component({
  selector: 'app-subscription-plan-managment',
  standalone: true,
  imports: [DynamicModalComponent, ModernTableComponent],
  templateUrl: './subscription-plan-managment.component.html',
  styleUrls: ['./subscription-plan-managment.component.css']
})
export class SubscriptionPlanManagmentComponent implements OnInit {
  SubscriptionPlan: any[] = [];
  columns: string[] = ['id', 'name', 'nameAr', 'description', 'descriptionAr'];
  deleteId: string = 'deletePlan';
  formData: any;
  isEdit = false;
  modalId = 'AddSubscriptionPlan';
  companyId: number = 0;
  structure = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'nameAr', label: 'NameAr', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'text', required: true },
    { name: 'descriptionAr', label: 'DescriptionAr', type: 'text', required: true },
  ];

  entityTypes: { [key: string]: { load: string, add: string, edit: string, delete: string, data: string } } = {
    SubscriptionPlan: {
      load: 'getSubscriptionPlan',
      add: 'addSubscriptionPlan',
      edit: 'editSubscriptionPlan',
      delete: 'deleteSubscriptionPlan',
      data: 'SubscriptionPlan'
    }
  };

  constructor(private subscriptionPlanService: SubscriptionPlanService) {
    this.companyId = Number(localStorage.getItem('companyId')) || 0;
  }

  ngOnInit(): void {
    this.loadEntities('SubscriptionPlan');
  }

  loadEntities(entity: string): void {
    const methodName = this.entityTypes[entity].load as keyof SubscriptionPlanService;
    (this.subscriptionPlanService[methodName] as Function)().subscribe(
      (response: any) => {
        if (response.status === 200) {
          (this as any)[this.entityTypes[entity].data] = response.data.list;
        }
      },
      (error: any) => {
        console.error(`Error fetching ${entity}`, error);
      }
    );
  }

  addEntity(entity: string, newEntity: any): void {
    const methodName = this.entityTypes[entity].add as keyof SubscriptionPlanService;
    (this.subscriptionPlanService[methodName] as Function)(newEntity).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.loadEntities(entity); // Reload the list
        }
      },
      (error: any) => {
        console.error(`Error adding ${entity}`, error);
      }
    );
  }

  editEntity(entity: string, updatedEntity: any): void {
    const methodName = this.entityTypes[entity].edit as keyof SubscriptionPlanService;
    (this.subscriptionPlanService[methodName] as Function)(updatedEntity).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.loadEntities(entity); // Reload the list
        }
      },
      (error: any) => {
        console.error(`Error updating ${entity}`, error);
      }
    );
  }

  deleteEntity(entity: string, id: number): void {
    const methodName = this.entityTypes[entity].delete as keyof SubscriptionPlanService;
    (this.subscriptionPlanService[methodName] as Function)(id).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.loadEntities(entity); // Reload the list
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
      this.editEntity('SubscriptionPlan', data);
    } else {
      data.id = 0;
      data.companyId = this.companyId;
      this.addEntity('SubscriptionPlan', data);
    }
  }

  openAddModal(): void {
    this.isEdit = false;
    this.formData = {};
  }

  openEditModal(item: any): void {
    this.isEdit = true;
    this.formData = { ...item, companyId: this.companyId };
  }
}
