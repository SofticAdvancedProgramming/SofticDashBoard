import { Component, OnInit } from '@angular/core';
import { DynamicModalComponent } from '../../../components/dynamic-modal/dynamic-modal.component';
import { ModernTableComponent } from '../../../components/modern-table/modern-table.component';
import { branch } from '../../../../../../models/branch';
import { BranchService } from '../../../../../services/lockupsServices/branchService/branch.service';

@Component({
  selector: 'app-branch-managment',
  standalone: true,
  templateUrl: './branch-managment.component.html',
  styleUrls: ['./branch-managment.component.css'],
  imports: [DynamicModalComponent, ModernTableComponent]
})
export class BranchManagmentComponent implements OnInit {
  Branches: branch[] = [];
  columns: string[] = ['id', 'name', 'nameAr', 'long', 'lat'];
  deleteId: string = 'deleteBranch';
  formData: branch | any = {};
  isEdit = false;
  modalId = 'AddBranch';
  companyId: number = 0;
  structure = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'nameAr', label: 'Name (Arabic)', type: 'text', required: true },
    { name: 'long', label: 'Longitude', type: 'number', required: true },
    { name: 'lat', label: 'Latitude', type: 'number', required: true }
  ];

  entityTypes: { [key: string]: { load: string, add: string, edit: string, delete: string, data: string } } = {
    Branch: {
      load: 'getBranch',
      add: 'addBranch',
      edit: 'editBranch',
      delete: 'deleteBranch',
      data: 'Branches'
    }
  };

  constructor(private branchService: BranchService) {
    this.companyId = Number(localStorage.getItem('companyId')) || 0;
  }

  ngOnInit(): void {
    this.loadEntities('Branch');
  }

  loadEntities(entity: string): void {
    const methodName = this.entityTypes[entity].load as keyof BranchService;
    (this.branchService[methodName] as Function)({companyId: this.companyId}).subscribe(
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
    const methodName = this.entityTypes[entity].add as keyof BranchService;
    (this.branchService[methodName] as Function)(newEntity).subscribe(
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
    const methodName = this.entityTypes[entity].edit as keyof BranchService;
    (this.branchService[methodName] as Function)(updatedEntity).subscribe(
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
    const methodName = this.entityTypes[entity].delete as keyof BranchService;
    (this.branchService[methodName] as Function)(id, this.companyId).subscribe(
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
      this.editEntity('Branch', data);
    } else {
      data.id = 0;
      data.companyId = this.companyId;
      this.addEntity('Branch', data);
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