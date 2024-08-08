import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { branch } from '../../../../../../../models/branch';
import { MapComponent } from "../../../../components/map/map.component";
import { MessageService } from 'primeng/api';
import { BranchService } from '../../../../../../services/lockupsServices/branchService/branch.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-add-branch',
  standalone: true,
  templateUrl: './add-branch.component.html',
  styleUrls: ['./add-branch.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ToastModule, MapComponent],
  providers: [MessageService]
})
export class AddBranchComponent implements OnInit {
  @Output() action = new EventEmitter<boolean>();
  @Output() branchAdded = new EventEmitter<void>();
  companyId: number | null = null;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private branchService: BranchService,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      nameAr: ['', Validators.required],
      long: [0, Validators.required],
      lat: [0, Validators.required]
    });
  }

  ngOnInit(): void {
    const storedCompanyId = localStorage.getItem('companyId');
    if (storedCompanyId) {
      this.companyId = Number(storedCompanyId);
    }
  }

  onSave(): void {
    if (this.form.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all required fields' });
      return;
    }

    const branchData: branch = {
      id: 0,
      companyId: this.companyId || 0,
      name: this.form.value.name,
      nameAr: this.form.value.nameAr,
      long: this.form.value.long,
      lat: this.form.value.lat,
    };

    this.branchService.addBranch(branchData).subscribe({
      next: (response) => {
        console.log('Branch added successfully', response);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Branch added successfully' });
        this.branchAdded.emit(); // Notify parent component to reload branches
        this.action.emit(false);
      },
      error: (err) => {
        console.error('Error adding branch', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error adding branch' });
      }
    });
  }

  onBack(): void {
    this.action.emit(false);
  }

  onLocationSelected(location: { lat: number, lng: number }): void {
    this.form.patchValue({ lat: location.lat, long: location.lng });
  }
}
