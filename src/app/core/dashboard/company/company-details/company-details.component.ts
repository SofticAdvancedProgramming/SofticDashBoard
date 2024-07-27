import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
import { ProfileDetailsComponent } from "../components/profile-details/profile-details.component";
import { BranchesComponent } from "../components/branches/branches.component";
import { TopManagmentComponent } from "../components/top-managment/top-managment.component";
import { PositionComponent } from "../components/positions/position.component";
import { IndexComponent } from "../components/position/index/index.component";

@Component({
    selector: 'app-company-details',
    standalone: true,
    templateUrl: './company-details.component.html',
    styleUrls: ['./company-details.component.css'],
    imports: [MatTabsModule, RouterLink, ProfileDetailsComponent, BranchesComponent, TopManagmentComponent, PositionComponent, IndexComponent]
})
export class CompanyDetailsComponent {
  role: any = JSON.parse(localStorage.getItem('roles')!);
  active: boolean = true;
  constructor(){
    console.log(this.role[0]);
  }
}   