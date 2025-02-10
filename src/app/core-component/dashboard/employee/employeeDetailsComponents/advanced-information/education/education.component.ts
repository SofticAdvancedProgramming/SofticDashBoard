import { Component, OnDestroy, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, tap } from 'rxjs';
import { LocalStorageService } from '../../../../../../services/local-storage-service/local-storage.service';
import { ActivatedRoute } from '@angular/router';
import { UserEducationService } from '../../../../../../services/userEducation/user-education.service';
import { Education } from '../../../../../../../models/advancedIfomation';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule],
  templateUrl: './education.component.html',
  styleUrl: './education.component.css',
  animations: [
    trigger('slideToggle', [
      state('void', style({ height: '0px', overflow: 'hidden' })),
      state('*', style({ height: '*', overflow: 'hidden' })),
      transition(':enter', [
        style({ height: '0px', overflow: 'hidden' }),
        animate('300ms ease-out', style({ height: '*' })),
      ]),
      transition(':leave', [
        style({ height: '*', overflow: 'hidden' }),
        animate('300ms ease-in', style({ height: '0px' })),
      ]),
    ]),
  ]
})
export class HighSchoolComponent implements OnInit, OnDestroy {
  isHighSchoolOpen = true;
  isBachelorDegreeOpen = true;
  isMasterDegreeOpen = false;
  isDoctorate = false;
  isShow: boolean = false;
  toggleHighSchool() {
    this.isHighSchoolOpen = !this.isHighSchoolOpen;
  }

  toggleBachelorDegree() {
    this.isBachelorDegreeOpen = !this.isBachelorDegreeOpen;
  }
  toggleMasterDegree() {
    this.isMasterDegreeOpen = !this.isMasterDegreeOpen;
  }
  toggleDectorate() {
    this.isDoctorate = !this.isDoctorate;
  }
  private unsubscribe$ = new Subject<void>();
  id: number = 0;
  userEducation?: Education;

  constructor(private userEducationService: UserEducationService,private localStorageService: LocalStorageService,private route:ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(params => {
      this.id = Number(params.get('id'));
      this.getEducation();
    })
  }
  get isArabic(): boolean {
    return localStorage.getItem('lang') === 'ar';
    //return this.localStorageService.getCurrentLanguage() === 'ar';
  }
  getEducation() {
    this.userEducationService
      .getEducation({employeeId: this.id})
      .pipe(
        tap((res) => {
          this.userEducation = res.data.list[0];

        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }
  showImgFull(){
    this.isShow = !this.isShow
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
