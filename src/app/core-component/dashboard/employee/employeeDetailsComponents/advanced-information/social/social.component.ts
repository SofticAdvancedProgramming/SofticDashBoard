import { Component } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { LocalStorageService } from '../../../../../../services/local-storage-service/local-storage.service';
import { UserSocialService } from '../../../../../../services/userSocialService/user-social.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-social',
  standalone: true,
  imports: [],
  templateUrl: './social.component.html',
  styleUrl: './social.component.css'
})
export class SocialComponent {

  private unsubscribe$ = new Subject<void>();
  id: number = 0;
  userSocial:any;

  constructor(private userSocialService: UserSocialService,private localStorageService: LocalStorageService,private route:ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(params => {
      this.id = Number(params.get('id'));
      this.getAddresses();
    })
  }

  getAddresses() {
    this.userSocialService
      .getSocial({id: this.id})
      .pipe(
        tap((res) => {
          this.userSocial = res.list[0];
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
