import { Component } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { LocalStorageService } from '../../../../../../services/local-storage-service/local-storage.service';
import { ActivatedRoute } from '@angular/router';
import { UserMedicalInsuranceService } from '../../../../../../services/userMedicalInsuranceService/user-medical-insurance.service';
import { Medical } from '../../../../../../../models/advancedIfomation';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-medical-insurance',
  standalone: true,
  imports: [TranslateModule,CommonModule,DatePipe],
  templateUrl: './medical-insurance.component.html',
  styleUrl: './medical-insurance.component.css',
})
export class MedicalInsuranceComponent {
  private unsubscribe$ = new Subject<void>();
  id: number = 0;
  userMedical?: Medical;

  constructor(
    private _UserMedicalInsuranceService: UserMedicalInsuranceService,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params) => {
        this.id = Number(params.get('id'));
        this.getMedicalInsurance();
      });
  }

  getMedicalInsurance() {
    this._UserMedicalInsuranceService
      .getMedicalInsurance({ employeeId: this.id })
      .pipe(
        tap((res) => {
          this.userMedical = res.data.list[0];
          console.log(res);
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
 
}
