import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { employee } from '../../../../../../../models/employee';
import { branch } from '../../../../../../../models/branch';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-assign-entity',
  templateUrl: './assign-entity.component.html',
  styleUrls: ['./assign-entity.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule , TranslateModule],
})
export class AssignEntityComponent {
  @Input() entityId?: string;
  @Input() entityType?: string;
  @Input() entities: employee[] = [];
  @Input() branch: branch | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<{ employeeId: number, branchId: number }>();
  isArabic: boolean =  localStorage.getItem('lang')=='ar'?true:false;
  assignForm: FormGroup;

  constructor(private fb: FormBuilder ,  private translate: TranslateService) {
    this.assignForm = this.fb.group({
      selectedEmployeeId: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.assignForm.valid && this.entityId) {
      this.submitForm.emit({
        employeeId: Number(this.assignForm.value.selectedEmployeeId),
        branchId: Number(this.entityId)
      });
    }
  }

  closePopup() {
    this.close.emit();
  }

  get selectedEmployeeId() {
    return this.assignForm.get('selectedEmployeeId');
  }
  ngOnInit(): void {
    this.isArabic = this.translate.currentLang === 'ar';
    this.translate.onLangChange.subscribe(event => {
      this.isArabic = event.lang === 'ar';
    });
  }
}
