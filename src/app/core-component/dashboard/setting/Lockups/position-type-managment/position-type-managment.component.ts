import { Component, OnInit } from '@angular/core';
import { DynamicModalComponent } from '../../../components/dynamic-modal/dynamic-modal.component';
import { ModernTableComponent } from '../../../components/modern-table/modern-table.component';
import { PositionTypeService } from '../../../../../services/lockupsServices/positionTypeService/position-type.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-position-type-managment',
  standalone: true,
  templateUrl: './position-type-managment.component.html',
  styleUrls: ['./position-type-managment.component.css'],
  imports: [DynamicModalComponent, ModernTableComponent, TranslateModule]
})
export class PositionTypeManagmentComponent implements OnInit {
  PositionTypes: any[] = [];
  columns: string[] = [  'name', 'nameAr'];
  deleteId: string = 'deletePositionType';
  formData: any;
  isEdit = false;
  modalId = 'AddPositionType';
  companyId: number = 0;
  structure = [
    { name: 'name', label: 'Name In English', type: 'text', required: true },
    { name: 'nameAr', label: 'Name In Arabic', type: 'text', required: true },
  ];
  pageIndex: any = {
    "PositionType": 1
  };
  totalRows: any = {
    "PositionType": 0
  };
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
    this.loadEntities('PositionType', this.pageIndex['PositionType']);
  }

  loadEntities(entity: string, pageIndex: number, name?:string): void {
    let query: any = { companyId: this.companyId, pageIndex };
    console.log(name);
    if(name){
    if (/^[a-zA-Z]/.test(name)) {
      query = {
        ...query,
        name:name
      };
    }else if(name){
      query = {
        ...query,
        nameAr:name
      };
    }}
    console.log(query)
    const methodName = this.entityTypes[entity].load as keyof PositionTypeService;
    (this.positionTypeService[methodName] as Function)(query).subscribe(
      (response: any) => {
        console.log(response);
        if (response.status === 200) {
          (this as any)[this.entityTypes[entity].data] = response.data.list;
          this.totalRows[entity] = response.data.totalRows;
          this.pageIndex[entity] = response.data.pageIndex;
        }
      }
    );
  }


  addEntity(entity: string, newEntity: any): void {
    const methodName = this.entityTypes[entity].add as keyof PositionTypeService;
    (this.positionTypeService[methodName] as Function)(newEntity).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.loadEntities(entity, this.pageIndex[entity]);
        }
      }
    );
  }

  editEntity(entity: string, updatedEntity: any): void {
    const methodName = this.entityTypes[entity].edit as keyof PositionTypeService;
    (this.positionTypeService[methodName] as Function)(updatedEntity).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.loadEntities(entity, this.pageIndex[entity]); // Reload the list
        }
      }
    );
  }

  deleteEntity(entity: string, id: number): void {
    const methodName = this.entityTypes[entity].delete as keyof PositionTypeService;
    (this.positionTypeService[methodName] as Function)(id, this.companyId).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.loadEntities(entity, this.pageIndex[entity]); // Reload the list
        }
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
