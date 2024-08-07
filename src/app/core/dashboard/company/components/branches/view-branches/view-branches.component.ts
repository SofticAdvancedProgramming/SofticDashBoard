import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
 import { AddBranchComponent } from '../add-branch/add-branch.component';
import { branch } from '../../../../../../../models/branch';
import { BranchService } from '../../../../../../services/lockupsServices/branchService/branch.service';

@Component({
  selector: 'app-view-branches',
  standalone: true,
  templateUrl: './view-branches.component.html',
  styleUrls: ['./view-branches.component.css'],
  imports: [CommonModule, AddBranchComponent]
})
export class ViewBranchesComponent implements OnInit {
  isAdd: boolean = false;
  showOverView: boolean = false;
  branches: branch[] = []; // Store branches data

  constructor(private branchService: BranchService) {}

  ngOnInit(): void {
    this.loadBranches();
  }

  loadBranches(): void {
    this.branchService.getBranch().subscribe({
      next: (response) => {
        this.branches = response.data.list;
        console.log('Branches loaded:', this.branches);
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
