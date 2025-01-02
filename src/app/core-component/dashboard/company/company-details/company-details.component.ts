import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
import { ProfileDetailsComponent } from '../components/profile-details/profile-details.component';
 import { TopManagmentComponent } from '../components/top-managment/top-managment.component';
import { IndexComponent } from '../components/position/index/index.component';
import { Company } from '../../../../../models/company';
import { CompanyService } from '../../../../services/comapnyService/company.service';
import { LocationService } from '../../../../services/lockupsServices/LocationService/location.service';
import { DepartmentsComponent } from "../components/department/departments/departments.component";
import { ViewBranchesComponent } from "../components/branches/view-branches/view-branches.component";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-company-details',
    standalone: true,
    templateUrl: './company-details.component.html',
    styleUrls: ['./company-details.component.css'],
    imports: [MatTabsModule,TranslateModule, RouterLink, ProfileDetailsComponent, TopManagmentComponent, IndexComponent, DepartmentsComponent, ViewBranchesComponent , CommonModule]
})
export class CompanyDetailsComponent implements OnInit {
  role: any = JSON.parse(localStorage.getItem('roles')!);
  active: boolean = true;
  companyId: string = '';
  company: Company = {} as Company;
  cityName: string = '';
  countryName: string = '';
  isArabic: boolean = false;
  activeTabIndex: number = 0; // Default tab index (first tab)
  constructor(
    private route: ActivatedRoute,
    private companyService: CompanyService,
    private locationService: LocationService,
    private messageService: MessageService,
    private translate: TranslateService,
    private router :Router
    
  ) {}

  async ngOnInit() {
    this.companyId = this.route.snapshot.paramMap.get('companyId')||'';
    if (this.companyId) {
      await this.getCompanyDetails(this.companyId);
    }
    this.route.queryParams.subscribe((params) => {
      const tab = params['tab'];
      this.activeTabIndex = tab ? parseInt(tab, 10) : 0; // Default to 0 if no tab param
    });
  }
  checkLanguageDirection(): void {
    this.isArabic = this.translate.currentLang === 'ar';
  }
  navigateToTab(index: number): void {
    this.activeTabIndex = index; // Update active tab
    this.router.navigate([], {
      queryParams: { tab: index }, // Update query params in URL
      queryParamsHandling: 'merge' // Merge with existing query params
    });
  }
  async getCompanyDetails(companyId: string): Promise<void> {
    try {
      const response = await this.companyService.getCompany({ id: companyId }).toPromise();
      if (response && response.data && response.data.list && response.data.list.length > 0) {
        this.company = response.data.list[0];
        if(this.company.countryId!=null){
          await this.fetchCityName(this.company.cityId);
        }

        if(this.company.cityId!=null){
          await this.fetchCountryName(this.company.countryId);
        }

      } else {
        console.error('Unexpected response structure:', response);
      }
    } catch (error) {
      console.error('Error fetching company details:', error);
    }
  }

  async fetchCityName(cityId: number): Promise<void> {
    try {
      const response = await this.locationService.getCities({ id: cityId }).toPromise();
      if (response && response.data && response.data.list && response.data.list.length > 0) {
        const city = response.data.list[0];
        this.cityName = city ? city.name : 'Unknown';
      } else {
        console.error('Unexpected city response structure:', response);
      }
    } catch (error) {
      console.error('Error fetching city details:', error);
    }
  }

  async fetchCountryName(countryId: number): Promise<void> {
    try {
      const response = await this.locationService.getCountries({ id: countryId }).toPromise();
      if (response && response.data && response.data.list && response.data.list.length > 0) {
        const country = response.data.list[0];
        this.countryName = country ? country.name : 'Unknown';
      } else {
        console.error('Unexpected country response structure:', response);
      }
    } catch (error) {
      console.error('Error fetching country details:', error);
    }
  }
  async toggleActivation(): Promise<void> {
    try {
      if (this.active) {
        await this.deactivateCompany();
      } else {
        await this.activateCompany();
      }
      this.active = !this.active; // Toggle the state after success
    } catch (error) {
      console.error('Error toggling company activation:', error);
    }
  }

  async activateCompany(): Promise<void> {
    if (this.company.id && this.companyId) {
      try {
        const response = await this.companyService.activatePosition(this.company.id, +this.companyId).toPromise();
      
        this.showSuccess('Company activated successfully');
      } catch (error) {
        console.error('Error activating company:', error);
      }
    } else {
      console.error('Invalid company ID or company not found');
    }
  }

  async deactivateCompany(): Promise<void> {
    if (this.company.id && this.companyId) {
      try {
        const response = await this.companyService.deactivatePosition(this.company.id, +this.companyId).toPromise();
        
        this.showSuccess('Company deactivated successfully');
      } catch (error) {
        console.error('Error deactivating company:', error);
      }
    } else {
      console.error('Invalid company ID or company not found');
    }
  }


  private showSuccess(detail: string): void {
    this.messageService.add({ severity: 'success', summary: 'Success', detail });
  }

}
