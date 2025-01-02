import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { LocalStorageService } from '../../../../../../services/local-storage-service/local-storage.service';
import { ActivatedRoute } from '@angular/router';
import { UserSkillsService } from '../../../../../../services/userSkillsService/user-skills.service';
import { Skills } from '../../../../../../../models/advancedIfomation';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-skills',
  standalone: true,
  imports: [TranslateModule, CommonModule, FormsModule],
  templateUrl: './user-skills.component.html',
  styleUrl: './user-skills.component.css'
})
export class UserSkillsComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  id: number = 0;
  userSkills?:Skills[];

  constructor(private userSkillsService: UserSkillsService,private localStorageService: LocalStorageService,private route:ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(params => {
      this.id = Number(params.get('id'));
     
      this.getSkills();
    })
  }

  getSkills() {
    this.userSkillsService
      .getSkills({employeeId: this.id})
      .pipe(
        tap((res) => {
          this.userSkills = res.data.list;
      
          
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
