import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { branch } from '../../../../../../../models/branch';

@Component({
  selector: 'app-add-branch',
  standalone: true,
  imports: [],
  templateUrl: './add-branch.component.html',
  styleUrl: './add-branch.component.css'
})
export class AddBranchComponent {
  @Output() action = new EventEmitter<boolean>();
   companyId: number | null = null;
  branches: branch[] = [];
}
