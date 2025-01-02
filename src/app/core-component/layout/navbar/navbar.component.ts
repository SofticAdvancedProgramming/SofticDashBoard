import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../services/user/user-service';
import { ChangeLanguageComponent } from "../../../common-component/change-language/change-language.component";
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbComponent } from '../../../common-component/breadcrumb/breadcrumb/breadcrumb.component';
@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  imports: [
    CommonModule,
    RouterLink,
    ChangeLanguageComponent,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    TranslateModule,
    BreadcrumbComponent
  ]
})
export class NavbarComponent {
  constructor(private userService: UserService) { }
  public unreadNotifications: number = 0;
  public notifications: { message: string; timestamp: Date; read: boolean }[] = [];
  public showNotifications: boolean = false; public lang = localStorage.getItem('lang') || 'en';
  public user = localStorage.getItem('userId') ? JSON.parse(localStorage.getItem('userId')!) : {};
  public roles = JSON.parse(localStorage.getItem('roles')!);
  public profileImage!: string;
  toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }
  ngOnInit(): void {
    this.userService.user$.subscribe(user => {
      this.profileImage = user?.profileImage || 'assets/images/default.jpeg';
      this.user = user || {};
    });
   
  

    // Load initial user data
    const storedUser = this.userService.getUser();
    if (storedUser) {
      this.user = storedUser; // Make sure this line is present to set initial user data
      this.profileImage = storedUser.profileImage;
    }
  }

  loadNotifications() {
    // Fetch the notifications from your service
    this.notifications = [
      { message: 'New message received', timestamp: new Date(), read: false },
      { message: 'Your profile was updated', timestamp: new Date(), read: true }
    ];

    // Calculate unread notifications
    this.unreadNotifications = this.notifications.filter(n => !n.read).length;
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  markAsRead(notification: any) {
    notification.read = true;
    this.unreadNotifications = this.notifications.filter(n => !n.read).length;
    this.showNotifications = false; // Close dropdown after click
  }

}
