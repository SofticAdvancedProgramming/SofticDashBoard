import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent {
  notifications = [
    { name: 'Yomna Ashraf', message: 'logged in to Softic company', date: '12/4/2024', pic: '../../../../assets/images/softic/Avatar.png', activate: false },
    { name: 'Iboit Company', message: 'Activate', date: '12/4/2024', pic: '../../../../assets/images/softic/Avatar.png', activate: true }
  ];
}
