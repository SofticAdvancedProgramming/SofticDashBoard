import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { LocalStorageService } from '../../../../../../services/local-storage-service/local-storage.service';
import { ActivatedRoute } from '@angular/router';
import { UserSkillsService } from '../../../../../../services/userSkillsService/user-skills.service';

@Component({
  selector: 'app-user-skills',
  standalone: true,
  imports: [],
  templateUrl: './user-skills.component.html',
  styleUrl: './user-skills.component.css'
})
export class UserSkillsComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  id: number = 0;
  userSkills:any;

  constructor(private userSkillsService: UserSkillsService,private localStorageService: LocalStorageService,private route:ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(params => {
      this.id = Number(params.get('id'));
      console.log(this.id);
      this.getSkills();
    })
  }

  getSkills() {
    this.userSkillsService
      .getSkills({userId: this.id})
      .pipe(
        tap((res) => {
          this.userSkills = res.data.list[0];
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
