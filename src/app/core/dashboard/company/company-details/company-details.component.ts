import { Component } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
import { ProfileDetailsComponent } from "../components/profile-details/profile-details.component";
import { BrunchesComponent } from "../components/brunches/brunches.component";
import { TopManagmentComponent } from "../components/top-managment/top-managment.component";

@Component({
    selector: 'app-company-details',
    standalone: true,
    templateUrl: './company-details.component.html',
    styleUrls: ['./company-details.component.css'],
    imports: [MatTabsModule, RouterLink, ProfileDetailsComponent, BrunchesComponent, TopManagmentComponent]
})
export class CompanyDetailsComponent {
  active: boolean = true;
}
