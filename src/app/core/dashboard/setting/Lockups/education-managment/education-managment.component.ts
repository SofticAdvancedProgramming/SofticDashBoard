import { Component } from '@angular/core';
import { EducationService } from '../../../../../services/lockupsServices/EducationService/education.service';

@Component({
  selector: 'app-education-managment',
  standalone: true,
  imports: [],
  templateUrl: './education-managment.component.html',
  styleUrl: './education-managment.component.css'
})
export class EducationManagmentComponent {

  universities: any[] = [];
  certificateTypes: any[] = [];

  entityTypes: { [key: string]: { load: string, add: string, edit: string, delete: string, data: string } } = {
    university: {
      load: 'getUniversities',
      add: 'addUniversity',
      edit: 'editUniversity',
      delete: 'deleteUniversity',
      data: 'universities'
    },
    certificateType: {
      load: 'getCertificateTypes',
      add: 'addCertificateType',
      edit: 'editCertificateType',
      delete: 'deleteCertificateType',
      data: 'certificateTypes'
    }
  };

  constructor(private educationService: EducationService) {}

  ngOnInit(): void {
    this.loadEntities('university');
    this.loadEntities('certificateType');
  }

  loadEntities(entity: string): void {
    const methodName = this.entityTypes[entity].load as keyof EducationService;
    (this.educationService[methodName] as Function)().subscribe(
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
    const methodName = this.entityTypes[entity].add as keyof EducationService;
    (this.educationService[methodName] as Function)(newEntity).subscribe(
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
    const methodName = this.entityTypes[entity].edit as keyof EducationService;
    (this.educationService[methodName] as Function)(updatedEntity).subscribe(
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

  deleteEntity(entity: string, id: number, companyId?: number): void {
    const methodName = this.entityTypes[entity].delete as keyof EducationService;
    if (entity === 'university' || entity === 'certificateType') {
      (this.educationService[methodName] as Function)(id, companyId).subscribe(
        (response: any) => {
          if (response.status === 200) {
            this.loadEntities(entity); 
          }
        },
        (error: any) => {
          console.error(`Error deleting ${entity}`, error);
        }
      );
    } else {
      (this.educationService[methodName] as Function)(id).subscribe(
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
  }
}
