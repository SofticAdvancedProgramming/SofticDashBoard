import { Component, OnInit } from '@angular/core';
import { BranchService } from '../../../../../../services/lockupsServices/branchService/branch.service';
import { branch } from '../../../../../../../models/branch';
import { MapComponent } from '../../../../components/map/map.component';
import { ToastModule } from 'primeng/toast';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddBranchComponent } from "../add-branch/add-branch.component";

@Component({
    selector: 'app-view-branches',
    standalone: true,
    templateUrl: './view-branches.component.html',
    styleUrls: ['./view-branches.component.css'],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ToastModule, MapComponent, AddBranchComponent]
})
export class ViewBranchesComponent implements OnInit {
  isAdd: boolean = false;
  showOverView: boolean = false;
  branches: branch[] = [];

  constructor(private branchService: BranchService) {}

  ngOnInit(): void {
    this.loadBranches();
  }

  loadBranches(): void {
    const companyId = localStorage.getItem('companyId');
    this.branchService.getBranch({ companyId }).subscribe({
      next: (response) => {
        this.branches = response.data.list;
        console.log("Branches loaded:", this.branches);
      },
      error: (err) => {
        console.error('Error loading branches', err);
      }
    });
  }

  addBranch(): void {
    this.isAdd = true;
  }

  handleAction(isAdd: boolean): void {
    this.isAdd = isAdd;
    console.log('Action emitted:', isAdd);
  }

  handleBranchAdded(): void {
    this.loadBranches(); // Reload branches after a branch is added
    this.isAdd = false;  // Ensure the add form is hidden
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
