import { Component } from '@angular/core';
import { LocationService } from '../../../../../services/lockupsServices/LocationService/location.service';

@Component({
  selector: 'app-location-managment',
  standalone: true,
  imports: [],
  templateUrl: './location-managment.component.html',
  styleUrl: './location-managment.component.css'
})
export class LocationManagmentComponent {

  countries: any[] = [];
  cities: any[] = [];
  zones: any[] = [];

  entityTypes: { [key: string]: { load: string, add: string, edit: string, delete: string, data: string } } = {
    country: {
      load: 'getCountries',
      add: 'addCountry',
      edit: 'editCountry',
      delete: 'deleteCountry',
      data: 'countries'
    },
    city: {
      load: 'getCities',
      add: 'addCity',
      edit: 'editCity',
      delete: 'deleteCity',
      data: 'cities'
    },
    zone: {
      load: 'getZones',
      add: 'addZone',
      edit: 'editZone',
      delete: 'deleteZone',
      data: 'zones'
    }
  };

  constructor(private locationService: LocationService) {}

  ngOnInit(): void {
    this.loadEntities('country');
    this.loadEntities('city');
    this.loadEntities('zone');
  }

  loadEntities(entity: string): void {
    const methodName = this.entityTypes[entity].load as keyof LocationService;
    (this.locationService[methodName] as Function)().subscribe(
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
    const methodName = this.entityTypes[entity].add as keyof LocationService;
    (this.locationService[methodName] as Function)(newEntity).subscribe(
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
    const methodName = this.entityTypes[entity].edit as keyof LocationService;
    (this.locationService[methodName] as Function)(updatedEntity).subscribe(
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

  deleteEntity(entity: string, id: number, companyId?: number): void {
    const methodName = this.entityTypes[entity].delete as keyof LocationService;
    if (entity === 'zone' || entity === 'city') {
      (this.locationService[methodName] as Function)(id, companyId).subscribe(
        (response: any) => {
          if (response.status === 200) {
            this.loadEntities(entity); // Reload the list
          }
        },
        (error: any) => {
          console.error(`Error deleting ${entity}`, error);
        }
      );
    } else {
      (this.locationService[methodName] as Function)(id).subscribe(
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
}