import { Component, OnInit } from '@angular/core';
import { SkillsTypeService } from '../../../../../services/lockupsServices/SkillsTypeService/skills-type.service';
import { DynamicModalComponent } from '../../../components/dynamic-modal/dynamic-modal.component';
import { skill } from '../../../../../../models/skill';
import { ModernTableComponent } from '../../../components/modern-table/modern-table.component';

@Component({
  selector: 'app-skills-type-management',
  standalone: true,
  imports: [DynamicModalComponent, ModernTableComponent],
  templateUrl: './skills-type-management.component.html',
  styleUrls: ['./skills-type-management.component.css']
})
export class SkillsTypeManagementComponent implements OnInit {
  skillsTypes: any[] = [];
  columns: string[] = ['id','name', 'nameAr'];

  entityTypes: { [key: string]: { load: string, add: string, edit: string, delete: string, data: string } } = {
    skillsType: {
      load: 'getSkillsTypes',
      add: 'addSkillsType',
      edit: 'editSkillsType',
      delete: 'deleteSkillsType',
      data: 'skillsTypes'
    }
  };

  constructor(private skillsTypeService: SkillsTypeService) {
    this.companyId = Number(localStorage.getItem('companyId')) || 0;
  }

  ngOnInit(): void {
    this.loadEntities('skillsType');
  }

  structure = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'nameAr', label: 'NameAr', type: 'text', required: true },
  ];

  formData:any;
  isEdit = false;
  modalId = 'AddEditSkillType';
  companyId: number = 0;

  loadEntities(entity: string): void {
    const methodName = this.entityTypes[entity].load as keyof SkillsTypeService;
    (this.skillsTypeService[methodName] as Function)().subscribe(
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
    const methodName = this.entityTypes[entity].add as keyof SkillsTypeService;
    (this.skillsTypeService[methodName] as Function)(newEntity).subscribe(
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
    const methodName = this.entityTypes[entity].edit as keyof SkillsTypeService;
    (this.skillsTypeService[methodName] as Function)(updatedEntity).subscribe(
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
    const methodName = this.entityTypes[entity].delete as keyof SkillsTypeService;
    (this.skillsTypeService[methodName] as Function)(id, companyId).subscribe(
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

  handleFormSubmission(data: skill) {
    if (this.isEdit) {
      data.companyId = this.companyId;
      data.id = this.formData.id;
      this.editEntity('skillsType', data);
    } else {
      data.id = 0;
      data.companyId = this.companyId;
      this.addEntity('skillsType', data);
    }
  }

  openAddModal() {
    this.isEdit = false;
    this.formData = {};
  }

  openEditModal(item: any) {
    this.isEdit = true;
    this.formData = item;
  }
}
