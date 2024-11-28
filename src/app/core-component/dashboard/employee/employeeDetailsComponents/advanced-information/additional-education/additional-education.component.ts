import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { LocalStorageService } from '../../../../../../services/local-storage-service/local-storage.service';
import { ActivatedRoute } from '@angular/router';
import { AdditionalEducationService } from '../../../../../../services/additionalEducationService/additional-education.service';
import { CommonModule } from '@angular/common';
import { Certificates } from '../../../../../../../models/advancedIfomation';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-additional-education',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './additional-education.component.html',
  styleUrl: './additional-education.component.css',
})
export class AdditionalEducationComponent implements OnInit, OnDestroy {
  isDiplomaOpen = true;
  isCertificateOpen = true;
  isAdditionalFields = false;
  toggleDiploma() {
    this.isDiplomaOpen = !this.isDiplomaOpen;
  }

  toggleCertificate() {
    this.isCertificateOpen = !this.isCertificateOpen;
  }
  toggleAdditionalFields() {
    this.isAdditionalFields = !this.isAdditionalFields;
  }
  private unsubscribe$ = new Subject<void>();
  id: number = 0;
  userEducation?: Certificates;

  constructor(
    private additionalEducationService: AdditionalEducationService,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params) => {
        this.id = Number(params.get('id'));
        this.getAditionalEducation();
      });
  }

  getAditionalEducation() {
    this.additionalEducationService
      .getAditionalEducation({ employeeId: this.id })
      .pipe(
        tap((res) => {
          this.userEducation = res.data.list[0];
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
