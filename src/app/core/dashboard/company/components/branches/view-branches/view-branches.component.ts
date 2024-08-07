import { Component } from '@angular/core';
import { AddBranchComponent } from "../add-branch/add-branch.component";
import { CommonModule } from '@angular/common';


import {  OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { BasicTableComponent } from '../../../../components/basic-table/basic-table.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Department } from '../../../../../../../models/department';
import { ApiCall } from '../../../../../../services/apiCall/apicall.service';
import { environment } from '../../../../../../environment/environment';
import { DepartmentService } from '../../../../../../services/lockupsServices/DepartmentService/department.service';
@Component({
    selector: 'app-view-branches',
    standalone: true,
    templateUrl: './view-branches.component.html',
    styleUrl: './view-branches.component.css',
    imports: [AddBranchComponent , CommonModule]
})
export class ViewBranchesComponent {
  isAdd: boolean = false;
  showOverView: boolean = false;

  addBranch(): void {
    this.isAdd = true;
  }
  handleAction(isAdd: boolean): void {
    this.isAdd = isAdd;
    console.log('Action emitted:', isAdd);
  }
  showDetails(cardId: number) {
    this.showOverView = true;
  }
  goBack() {
    if (this.showOverView) {
      this.showOverView = false;
    } else if (this.isAdd) {
      this.isAdd = false;
    }
  }

}
