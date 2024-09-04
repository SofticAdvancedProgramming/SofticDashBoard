import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../services/user/user-service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private userService: UserService) { }

  public lang = localStorage.getItem('lang') || 'en';
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
    console.log('User:', this.user);
    console.log('Roles:', this.roles);
    
    // Load initial user data
    const storedUser = this.userService.getUser();
    if (storedUser) {
      this.user = storedUser; // Make sure this line is present to set initial user data
      this.profileImage = storedUser.profileImage;
    }
  }
  
}
