import { Component } from '@angular/core';
import { LocationService } from '../../../../../services/lockupsServices/LocationService/location.service';
import { DynamicModalComponent } from '../../../components/dynamic-modal/dynamic-modal.component';
import { ModernTableComponent } from '../../../components/modern-table/modern-table.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-location-managment',
  standalone: true,
  imports: [DynamicModalComponent, ModernTableComponent, FormsModule,CommonModule],
  templateUrl: './location-managment.component.html',
  styleUrls: ['./location-managment.component.css']
})
export class LocationManagmentComponent {

  countries: any[] = [];
  cities: any[] = [];
  zones: any[] = [];
  formData: any;
  CityformData: any;
  isEdit = false;
  isEditCity = false;
  modalId = 'AddCountry';
  citymodalId = 'Addcity';
  countryDeleteId = 'countryDelete';
  cityDeleteId = 'cityDeleteId';
  companyId: number = 0;
  selectedCountryId: number = 0;
  columns: string[] = ['id', 'name', 'nameAr'];
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

  countryStructure = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'nameAr', label: 'NameAr', type: 'text', required: true },
  ];

  cityStructure = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'nameAr', label: 'NameAr', type: 'text', required: true },
    { name: 'countryId', label: 'Country ID', type: 'number', required: true },
  ];

  constructor(private locationService: LocationService) {
    this.companyId = Number(localStorage.getItem('companyId')) || 0;
  }

  ngOnInit(): void {
    this.loadEntities('country');
  }

  trackById(index: number, item: any): number {
    return item.id;
  }

  onCountryChange(): void {
    this.loadEntities('city', this.selectedCountryId);
  }

  loadEntities(entity: string, objectId?: number): void {
    const methodName = this.entityTypes[entity].load as keyof LocationService;
    const params = entity === 'city' ? { countryId: objectId } : {};
    (this.locationService[methodName] as Function)(params).subscribe(
      (response: any) => {
        if (response.status === 200) {
          (this as any)[this.entityTypes[entity].data] = response.data.list;
          console.log(response.data.list);
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
          if (entity === 'city') {
            this.loadEntities(entity, this.selectedCountryId);
          } else {
            this.loadEntities(entity);
          }
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
        if (entity === 'city') {
          this.loadEntities(entity, this.selectedCountryId);
        } else {
          this.loadEntities(entity);
        }
      },
      (error: any) => {
        console.error(`Error updating ${entity}`, error);
      }
    );
  }

  deleteEntity(entity: string, id: number, companyId?: number): void {
    const methodName = this.entityTypes[entity].delete as keyof LocationService;
    (this.locationService[methodName] as Function)(id, companyId).subscribe(
      (response: any) => {
        if (response.status === 200) {
          if (entity === 'city') {
            this.loadEntities(entity, this.selectedCountryId);
          } else {
            this.loadEntities(entity);
          }
        }
      },
      (error: any) => {
        console.error(`Error deleting ${entity}`, error);
      }
    );
  }

  //country
  openCountryAddModal(): void {
    this.isEdit = false;
    this.formData = {};
  }

  openCountryEditModal(item: any): void {
    this.isEdit = true;
    this.formData = { ...item, companyId: this.companyId };
  }

  handleCountrySubmission(data: any): void {
    if (this.isEdit) {
      data.companyId = this.companyId;
      data.id = this.formData.id;
      this.editEntity('country', data);
    } else {
      data.id = 0;
      data.companyId = this.companyId;
      this.addEntity('country', data);
    }
  }
  //end country

  //city
  openCityAddModal(): void {
    this.isEditCity = false;
    this.CityformData = {};
  }

  openCityEditModal(item: any): void {
    this.isEditCity = true;
    this.CityformData = { ...item, companyId: this.companyId };
  }

  handleCitySubmission(data: any): void {
    if (this.isEditCity) {
      data.companyId = this.companyId;
      data.id = this.CityformData.id;
      data.countryId = this.selectedCountryId;
      this.editEntity('city', data);
    } else {
      data.id = 0;
      data.companyId = this.companyId;
      data.countryId = this.selectedCountryId;
      this.addEntity('city', data);
    }
  }
  //end city
}
