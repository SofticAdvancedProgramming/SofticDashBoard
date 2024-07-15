import { Component } from '@angular/core';
import { MedicalInsuranceCompanyService } from '../../../../../services/lockupsServices/MedicalInsuranceCompanyService/medical-insurance-company.service';

@Component({
  selector: 'app-insurance-company-managment',
  standalone: true,
  imports: [],
  templateUrl: './medical-insurance-company-managment.component.html',
  styleUrl: './medical-insurance-company-managment.component.css'
})
export class medicalInsuranceCompanyManagmentComponent {

  medicalInsuranceCompanies: any[] = [];

  entityTypes: { [key: string]: { load: string, add: string, edit: string, delete: string, data: string } } = {
    medicalInsuranceCompany: {
      load: 'getMedicalInsuranceCompanies',
      add: 'addMedicalInsuranceCompany',
      edit: 'editMedicalInsuranceCompany',
      delete: 'deleteMedicalInsuranceCompany',
      data: 'medicalInsuranceCompanies'
    }
  };

  constructor(private medicalInsuranceCompanyService: MedicalInsuranceCompanyService) {}

  ngOnInit(): void {
    this.loadEntities('medicalInsuranceCompany');
  }

  loadEntities(entity: string): void {
    const methodName = this.entityTypes[entity].load as keyof MedicalInsuranceCompanyService;
    (this.medicalInsuranceCompanyService[methodName] as Function)().subscribe(
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
    const methodName = this.entityTypes[entity].add as keyof MedicalInsuranceCompanyService;
    (this.medicalInsuranceCompanyService[methodName] as Function)(newEntity).subscribe(
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
    const methodName = this.entityTypes[entity].edit as keyof MedicalInsuranceCompanyService;
    (this.medicalInsuranceCompanyService[methodName] as Function)(updatedEntity).subscribe(
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
    const methodName = this.entityTypes[entity].delete as keyof MedicalInsuranceCompanyService;
    (this.medicalInsuranceCompanyService[methodName] as Function)(id, companyId).subscribe(
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
}
