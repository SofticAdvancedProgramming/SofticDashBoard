import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DepartmentService } from '../../../../../../services/lockupsServices/DepartmentService/department.service';
import { Department } from '../../../../../../../models/department';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MapComponent } from '../../../../components/map/map.component';
import { BranchService } from '../../../../../../services/lockupsServices/branchService/branch.service';
import { branch } from '../../../../../../../models/branch';
import { LeafletMapComponent } from "../../../../../../common-component/leaflet-map/leaflet-map.component";
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { InputRestrictionDirective } from '../../../../../../common-component/directives/lang-directive/input-restriction.directive';

@Component({
    selector: 'app-add-department',
    standalone: true,
    templateUrl: './add-department.component.html',
    styleUrls: ['./add-department.component.css'],
    providers: [MessageService],
    imports: [CommonModule, TranslateModule, FormsModule, ReactiveFormsModule, ToastModule, MapComponent, LeafletMapComponent,InputRestrictionDirective]
})
export class AddDepartmentComponent implements OnInit {
  @Output() action = new EventEmitter<boolean>();
  form: FormGroup;
  branches: branch[] = [];
  @Input() companyId?: number;

  descriptionCharacterCount: number = 0;
  descriptionArCharacterCount: number = 0;

  constructor(
    private fb: FormBuilder,
    private departmentService: DepartmentService,
    private branchService: BranchService,
    private messageService: MessageService,
    private translate: TranslateService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      nameAr: ['', Validators.required],
      shortName: ['', Validators.required],
      long: [0, Validators.required],
      lat: [0, Validators.required],
      manager: ['', Validators.required],
      branchId: [null, Validators.required],
      description: ['', [Validators.required, Validators.minLength(100), Validators.maxLength(250)]],
      descriptionAr: ['', [Validators.required, Validators.minLength(100), Validators.maxLength(250)]]
    });
  }

  ngOnInit(): void {
    const storedCompanyId = localStorage.getItem('companyId');
    if (storedCompanyId) {
      this.companyId = Number(storedCompanyId);
    }
    this.loadBranches();
    this.updateCharacterCount('description');
    this.updateCharacterCount('descriptionAr');
  }

  loadBranches(): void {
    this.branchService.getBranch({ companyId: this.companyId }).subscribe({
      next: (response) => {
        this.branches = response.data.list;
      },
      error: (err) => {
        console.error('Error loading branches', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load branches' });
      }
    });
  }

  onSave(): void {
    if (this.form.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all required fields' });
      return;
    }

    const departmentData: Department = {
      id: 0,
      companyId: this.companyId || 0,
      name: this.form.value.name,
      shortName: this.form.value.shortName,
      nameAr: this.form.value.nameAr,
      description: this.form.value.description,
      descriptionAr: this.form.value.descriptionAr,
      manager: this.form.value.manager,
      branchId: this.form.value.branchId,
      long: this.form.value.long,
      lat: this.form.value.lat
    };

    this.departmentService.addDepartment(departmentData).subscribe({
      next: (response) => {
        console.log('Department added successfully', response);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Department added successfully' });
        setTimeout(() => {
          this.action.emit(false);
        }, 1000);
      },
      error: (err) => {
        console.error('Error adding department', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error adding department' });
      }
    });
  }

  onBack(): void {
    this.action.emit(false);
  }

  onLocationSelected(location: { lat: number, lng: number }): void {
    this.form.patchValue({ lat: location.lat, long: location.lng });
  }

  updateCharacterCount(controlName: string): void {
    const control = this.form.get(controlName);
    if (control) {
      const valueLength = control.value ? control.value.length : 0;
      if (controlName === 'description') {
        this.descriptionCharacterCount = valueLength;
      } else if (controlName === 'descriptionAr') {
        this.descriptionArCharacterCount = valueLength;
      }
    }
  }
}
