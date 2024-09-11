import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProfileCardsComponent } from '../../components/profile-cards/profile-cards.component';
import { RouterLink } from '@angular/router';
import { AuthenticationService } from '../../../../services/authenticationService/authentication.service';
import { UserService } from '../../../../services/user/user-service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ProfileCardsComponent, RouterLink, TranslateModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  public user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : {};
  public userId = +localStorage.getItem('userId')!;
  public roles = JSON.parse(localStorage.getItem('roles')!);
  constructor(
    private authService: AuthenticationService,
  ) {
    this.getPersonalInformation();
  }

  getPersonalInformation() {
    this.authService.getPersonalInformation({ id: this.userId }).subscribe({
      next: (userResponse) => {
        this.user = userResponse.list[0];
      }
    });
  }
}
