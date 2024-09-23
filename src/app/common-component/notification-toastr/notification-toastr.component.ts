import { Component } from '@angular/core';

@Component({
  selector: 'app-notification-toastr',
  standalone: true,
  imports: [],
  templateUrl: './notification-toastr.component.html',
  styleUrl: './notification-toastr.component.css'
})
export class NotificationToastrComponent {
  public message: any = null

}
