import { Component, OnInit } from '@angular/core';
import { BusinessService } from '../../../../../services/lockupsServices/BusinessService/business.service';

@Component({
  selector: 'app-bussiness-managment',
  standalone: true,
  templateUrl: './bussiness-managment.component.html',
  styleUrls: ['./bussiness-managment.component.css']
})
export class BussinessManagmentComponent implements OnInit {

  businessSizes: any[] = [];
  businessTypes: any[] = [];

  entityTypes: { [key: string]: { load: string, add: string, edit: string, delete: string, data: string } } = {
    businessSize: {
      load: 'getBusinessSizes',
      add: 'addBusinessSize',
      edit: 'editBusinessSize',
      delete: 'deleteBusinessSize',
      data: 'businessSizes'
    },
    businessType: {
      load: 'getBusinessTypes',
      add: 'addBusinessType',
      edit: 'editBusinessType',
      delete: 'deleteBusinessType',
      data: 'businessTypes'
    }
  };

  constructor(private businessService: BusinessService) {}

  ngOnInit(): void {
    this.loadEntities('businessSize');
    this.loadEntities('businessType');
  }

  loadEntities(entity: string): void {
    const methodName = this.entityTypes[entity].load as keyof BusinessService;
    (this.businessService[methodName] as Function)().subscribe(
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
    const methodName = this.entityTypes[entity].add as keyof BusinessService;
    (this.businessService[methodName] as Function)(newEntity).subscribe(
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
    const methodName = this.entityTypes[entity].edit as keyof BusinessService;
    (this.businessService[methodName] as Function)(updatedEntity).subscribe(
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
    const methodName = this.entityTypes[entity].delete as keyof BusinessService;
    (this.businessService[methodName] as Function)(id, companyId).subscribe(
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