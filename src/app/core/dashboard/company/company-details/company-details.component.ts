import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
import { ProfileDetailsComponent } from "../components/profile-details/profile-details.component";
import { BranchesComponent } from "../components/branches/branches.component";
import { TopManagmentComponent } from "../components/top-managment/top-managment.component";
import { IndexComponent } from "../components/position/index/index.component";
import { CompanyService } from '../../../../services/comapnyService/company.service';

@Component({
  selector: 'app-company-details',
  standalone: true,
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.css'],
  imports: [MatTabsModule, RouterLink, ProfileDetailsComponent, BranchesComponent, TopManagmentComponent, IndexComponent]
})
export class CompanyDetailsComponent {
  role: any = JSON.parse(localStorage.getItem('roles')!);
  active: boolean = true;
  companyId: string | null = null;
  comapny?:Comapny
  constructor(private route: ActivatedRoute,private CompanyService:CompanyService) {
    this.route.paramMap.subscribe(params => {
      this.companyId = params.get('companyId');
    });

    comapny
  }
}
