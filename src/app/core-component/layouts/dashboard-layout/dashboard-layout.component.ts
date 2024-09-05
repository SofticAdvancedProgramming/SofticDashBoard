import { Component } from '@angular/core';
import { FooterComponent } from '../../layout/footer/footer.component';
import { NavbarComponent } from '../../layout/navbar/navbar.component';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [SidebarComponent,NavbarComponent,FooterComponent,RouterOutlet, FormsModule , CommonModule],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css'
})
export class DashboardLayoutComponent {
  isArabic: boolean = false;

  constructor(private translate: TranslateService) {
    this.isArabic = this.translate.currentLang === 'ar';

    this.translate.onLangChange.subscribe((event) => {
      this.isArabic = event.lang === 'ar';
    });
  }
}
