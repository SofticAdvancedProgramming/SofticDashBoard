import { Component } from '@angular/core';
import { LifeStyleTypeService } from '../../../../../services/lockupsServices/LifeStyleTypeService/life-style-type.service';
import {LifeStyle, user} from '../../../../../../models/user'
import { DynamicModalComponent } from '../../../components/dynamic-modal/dynamic-modal.component';
import { ModernTableComponent } from '../../../components/modern-table/modern-table.component';

@Component({
    selector: 'app-life-style-type-managment',
    standalone: true,
    templateUrl: './life-style-type-managment.component.html',
    styleUrl: './life-style-type-managment.component.css',
    imports: [DynamicModalComponent, ModernTableComponent]
})
export class LifeStyleTypeManagmentComponent {

  lifeStyleTypes: any[] = [];
  columns: string[] = ['id','name', 'nameAr'];

  // for popup
  structure = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'nameAr', label: 'NameAr', type: 'text', required: true },
  ];

  formData :any;
  isEdit = false;
  modalId = 'AddEditLifeStyle';
  companyId: number = 0;

  entityTypes: { [key: string]: { load: string, add: string, edit: string, delete: string, data: string } } = {
    lifeStyleType: {
      load: 'getLifeStyleTypes',
      add: 'addLifeStyleType',
      edit: 'editLifeStyleType',
      delete: 'deleteLifeStyleType',
      data: 'lifeStyleTypes'
    }
  };

  constructor(private lifeStyleTypeService: LifeStyleTypeService) {
    this.companyId = Number(localStorage.getItem('companyId')) || 0;
  }

  ngOnInit(): void {
    this.loadEntities('lifeStyleType');
  }

  loadEntities(entity: string): void {
    const methodName = this.entityTypes[entity].load as keyof LifeStyleTypeService;
    (this.lifeStyleTypeService[methodName] as Function)().subscribe(
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
    const methodName = this.entityTypes[entity].add as keyof LifeStyleTypeService;
    (this.lifeStyleTypeService[methodName] as Function)(newEntity).subscribe(
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
    const methodName = this.entityTypes[entity].edit as keyof LifeStyleTypeService;
    (this.lifeStyleTypeService[methodName] as Function)(updatedEntity).subscribe(
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

  deleteEntity(entity: string, id: number, companyId: number): void {
    const methodName = this.entityTypes[entity].delete as keyof LifeStyleTypeService;
    (this.lifeStyleTypeService[methodName] as Function)(id, companyId).subscribe(
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
  handleFormSubmission(data: LifeStyle) {
    if (this.isEdit) {
      data.companyId = this.companyId;
      data.id = this.formData.id;
      this.editEntity('lifeStyleType', data);
    } else {
      data.id = 0;
      data.companyId = this.companyId;
      this.addEntity('lifeStyleType', data);
    }
  }

  openAddModal() {
    this.isEdit = false;
    this.formData = {};
  }

  openEditModal(item: any) {
    console.log("item",item)
    this.isEdit = true;
    this.formData = { ...item, companyId: this.companyId };
  }
}
