import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { branch } from '../../../../../../../models/branch';
import { MessageService } from 'primeng/api';
import { BranchService } from '../../../../../../services/lockupsServices/branchService/branch.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { MapComponent } from '../../../../../../common-component/map/map.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-branch',
  standalone: true,
  templateUrl: './add-branch.component.html',
  styleUrls: ['./add-branch.component.css'],
  providers: [MessageService],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ToastModule, MapComponent, TranslateModule]
})
export class AddBranchComponent implements OnInit {
  @Input() isEdit: boolean = false;
  @Input() branch!: branch;
  @Input() companyId?: number;
  @Output() action = new EventEmitter<boolean>();
  @Output() branchAdded = new EventEmitter<void>();

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private branchService: BranchService,
    private messageService: MessageService,
    private translate: TranslateService,
    private router:Router,
    private activatedRoute:ActivatedRoute

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
    if (this.isEdit) {
      this.initoForm();
    }
  }

  initoForm() {
    this.form.patchValue({
      name: this.branch?.name,
      nameAr: this.branch?.nameAr,
      long: this.branch?.long,
      lat: this.branch?.lat
    })
  }

  onSave(): void {
    if (this.form.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all required fields' });
      return;
    }

    const branchData: branch = {
      id: this.branch?.id || 0,
      companyId: this.companyId || 0,
      name: this.form.value.name,
      nameAr: this.form.value.nameAr,
      long: this.form.value.long,
      lat: this.form.value.lat,
    };

    this.branchService[this.isEdit ? 'editBranch' : 'addBranch'](branchData).subscribe({
      next: (response) => {
        console.log('Branch added successfully', response);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: this.isEdit ? 'Branch Edit successfully' : 'Branch added successfully' });
        if (this.isEdit) {
          setTimeout(() => {
            this.branchAdded.emit();
            this.action.emit(false);
          }, 1000);
        } else {
          this.form.reset()
        }
      }
    });
    this.ngOnInit();
    this.action.emit(false);
  }

  onBack(): void {
    this.action.emit(false);
  }

  onLocationSelected(location: { lat: number, lng: number }): void {
    this.form.patchValue({ lat: location.lat, long: location.lng });
  }
}
