import { Component } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
import { ProfileDetailsComponent } from "../components/profile-details/profile-details.component";
import { BranchesComponent } from "../components/branches/branches.component";
import { TopManagmentComponent } from "../components/top-managment/top-managment.component";

@Component({
    selector: 'app-company-details',
    standalone: true,
    templateUrl: './company-details.component.html',
    styleUrls: ['./company-details.component.css'],
    imports: [MatTabsModule, RouterLink, ProfileDetailsComponent, BranchesComponent, TopManagmentComponent]
})
export class CompanyDetailsComponent {
  active: boolean = true;
}
