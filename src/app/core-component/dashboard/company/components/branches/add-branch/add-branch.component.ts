import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { branch } from '../../../../../../../models/branch';
import { MapComponent } from "../../../../components/map/map.component";
import { MessageService } from 'primeng/api';
import { BranchService } from '../../../../../../services/lockupsServices/branchService/branch.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { LeafletMapComponent } from "../../../../../../common-component/leaflet-map/leaflet-map.component";
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-add-branch',
    standalone: true,
    templateUrl: './add-branch.component.html',
    styleUrls: ['./add-branch.component.css'],
    providers: [MessageService],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ToastModule, MapComponent, LeafletMapComponent, TranslateModule]
})
export class AddBranchComponent implements OnInit {
  @Input() companyId?: number ;
  @Output() action = new EventEmitter<boolean>();
  @Output() branchAdded = new EventEmitter<void>();

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private branchService: BranchService,
    private messageService: MessageService,
    private translate: TranslateService

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
        setTimeout(() => {
          this.branchAdded.emit();
          this.action.emit(false);
        }, 1000);

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
