import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './core-component/dashboard/home/home.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { LoaderComponent } from "./common-component/loader/loader.component";
import { TranslationService } from './core/services/translationService/translation.service';
import { MessagingService } from './services/messaging-service/messaging.service';
import { NotificationToastrComponent } from "./common-component/notification-toastr/notification-toastr.component";
import { BreadcrumbComponent } from './common-component/breadcrumb/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent, ToastModule, LoaderComponent, NotificationToastrComponent,BreadcrumbComponent],
  providers: [MessageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  lang?: string;
  title = 'Softic-dashboard';

  constructor(
    private translationService: TranslationService,
    private messagingService: MessagingService,
  ) {
    if (typeof window !== 'undefined') {
      this.checkLang();
      this.messagingService.receiveMessaging();
    }
  }

  checkLang() {
    let currentlanguage = localStorage.getItem('lang');
    if (currentlanguage) {
      this.lang = currentlanguage;
      this.translationService.changeLang(currentlanguage);
    } else {
      localStorage.setItem('lang', 'en');
      //default will be en
      this.lang = 'en';
      this.translationService.changeLang('en');
    }
  }
}
