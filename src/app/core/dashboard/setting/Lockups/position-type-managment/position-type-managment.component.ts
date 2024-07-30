import { Component, OnInit } from '@angular/core';
import { DynamicModalComponent } from '../../../components/dynamic-modal/dynamic-modal.component';
import { ModernTableComponent } from '../../../components/modern-table/modern-table.component';
import { PositionTypeService } from '../../../../../services/lockupsServices/positionTypeService/position-type.service';

@Component({
  selector: 'app-position-type-managment',
  standalone: true,
  templateUrl: './position-type-managment.component.html',
  styleUrls: ['./position-type-managment.component.css'],
  imports: [DynamicModalComponent, ModernTableComponent]
})
export class PositionTypeManagmentComponent implements OnInit {
  PositionTypes: any[] = [];
  columns: string[] = ['id', 'name', 'nameAr'];
  deleteId: string = 'deletePositionType';
  formData: any;
  isEdit = false;
  modalId = 'AddPositionType';
  companyId: number = 0;
  structure = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'nameAr', label: 'NameAr', type: 'text', required: true },
  ];

  entityTypes: { [key: string]: { load: string, add: string, edit: string, delete: string, data: string } } = {
    PositionType: {
      load: 'getPositionTypes',
      add: 'addPositionType',
      edit: 'editPositionType',
      delete: 'deletePositionType',
      data: 'PositionTypes'
    }
  };

  constructor(private positionTypeService: PositionTypeService) {
    this.companyId = Number(localStorage.getItem('companyId')) || 0;
  }

  ngOnInit(): void {
    this.loadEntities('PositionType');
  }

  loadEntities(entity: string): void {
    const methodName = this.entityTypes[entity].load as keyof PositionTypeService;
    (this.positionTypeService[methodName] as Function)({companyId:this.companyId}, this.companyId).subscribe(
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
    const methodName = this.entityTypes[entity].add as keyof PositionTypeService;
    (this.positionTypeService[methodName] as Function)(newEntity, this.companyId).subscribe(
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
    const methodName = this.entityTypes[entity].edit as keyof PositionTypeService;
    (this.positionTypeService[methodName] as Function)(updatedEntity, this.companyId).subscribe(
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
    const methodName = this.entityTypes[entity].delete as keyof PositionTypeService;
    (this.positionTypeService[methodName] as Function)(id, this.companyId).subscribe(
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
      this.editEntity('PositionType', data);
    } else {
      data.id = 0;
      data.companyId = this.companyId;
      this.addEntity('PositionType', data);
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
