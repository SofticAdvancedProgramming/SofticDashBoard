import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthenticationService } from '../../../services/authenticationService/authentication.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  role: any = JSON.parse(localStorage.getItem('roles')!);
  companyId: string = localStorage.getItem('companyId')!
  isExpanded = false;
  isVisible = true;

  constructor(private authService: AuthenticationService) { }

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }

  hideSidebar() {
    this.isVisible = false;
  }

  showSidebar() {
    this.isVisible = true;
  }

  logout() {
    this.authService.logout();
  }
}
