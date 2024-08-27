import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {MatTabsModule} from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { PersonalInformationComponent } from "../employeeDetailsComponents/personal-information/personal-information.component";
import { AdvancedInformationComponent } from "../employeeDetailsComponents/advanced-information/advanced-information.component";

@Component({
    selector: 'app-employee-details',
    standalone: true,
    templateUrl: './employee-details.component.html',
    styleUrl: './employee-details.component.css',
    imports: [RouterLink, MatTabsModule, CommonModule, PersonalInformationComponent, AdvancedInformationComponent]
})
export class EmployeeDetailsComponent {
  activeTab: string = 'personal';

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}
