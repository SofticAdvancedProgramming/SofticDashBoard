import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocalStorageService } from '../../../../../../services/local-storage-service/local-storage.service';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil, tap } from 'rxjs';
import { UserJobExperienceService } from '../../../../../../services/JobExperienceService/user-job-experience.service';
import { CommonModule, DatePipe } from '@angular/common';
import { WorkHistory } from '../../../../../../../models/advancedIfomation';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-job-experience',
  standalone: true,
  imports: [TranslateModule,DatePipe,CommonModule],
  templateUrl: './job-experience.component.html',
  styleUrl: './job-experience.component.css'
})
export class JobExperienceComponent implements OnInit, OnDestroy {
  id: any;
  userJobExperience!: WorkHistory[];
  private unsubscribe$ = new Subject<void>();
  constructor(private userJobExperienceService: UserJobExperienceService,private localStorageService: LocalStorageService,private route:ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(params => {
      this.id = Number(params.get('id'));
      this.getWorkExperinece();
    })
  }

  getWorkExperinece() {
    this.userJobExperienceService
      .getJobExperience({employeeId: this.id})
      .pipe(
        tap((res) => {
          this.userJobExperience = res.data.list;
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

  isImage(file: string): boolean {
    return /\.(jpg|jpeg|png|gif)$/i.test(file);
  }

  isPDF(file: string): boolean {
    return /\.pdf$/i.test(file);
  }

  isText(file: string): boolean {
    return /\.(txt|log)$/i.test(file);
  }
  
}
