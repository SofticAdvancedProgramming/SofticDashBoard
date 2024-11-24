import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocalStorageService } from '../../../../../../services/local-storage-service/local-storage.service';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil, tap } from 'rxjs';
import { UserJobExperienceService } from '../../../../../../services/JobExperienceService/user-job-experience.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-job-experience',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './job-experience.component.html',
  styleUrl: './job-experience.component.css'
})
export class JobExperienceComponent implements OnInit, OnDestroy {
  id: any;
  userJobExperience: any;
  private unsubscribe$ = new Subject<void>();
  constructor(private userJobExperienceService: UserJobExperienceService,private localStorageService: LocalStorageService,private route:ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(params => {
      this.id = Number(params.get('id'));
      this.getEducation();
    })
  }

  getEducation() {
    this.userJobExperienceService
      .getJobExperience({employeeId: this.id})
      .pipe(
        tap((res) => {
          this.userJobExperience = res.data.list[0];
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
