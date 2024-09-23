import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { getToken, Messaging, onMessage } from '@angular/fire/messaging'
@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  currentMessage = new BehaviorSubject<any>(null);
  countNotifications = signal(0);

  constructor(
    private _messaging: Messaging,
  ) {
  }

  async getFCMToken(): Promise<string | null> {
    try {
      const token = await getToken(this._messaging);
      console.log(token);
      return token; // Return the FCM token if successful
    } catch (error) {
      console.error('Token error', error);
      return null; // Return null if there's an error
    }
  }



  public receiveMessageing(): void {
    onMessage(this._messaging, {
      next: (payload: any) => {
        this.currentMessage.next(payload);
        this.showToast(payload.notification.title, payload.notification.body);
      },
      error: (error) => console.log('Message error', error),
      complete: () => console.log('Done listening to messages'),
    });
  }

  showToast(title: string, body: string) {
    if (typeof window !== 'undefined') {
      import('bootstrap').then(({ Toast }) => {
        const toastElement = document.getElementById('liveToast');
        if (toastElement) {
          // Update the title and body dynamically before showing the toast
          const toastTitleElement = toastElement.querySelector('.toast-header strong');
          const toastBodyElement = toastElement.querySelector('.toast-body');

          if (toastTitleElement) {
            toastTitleElement.textContent = title;
          }

          if (toastBodyElement) {
            toastBodyElement.textContent = body;
          }

          // Show the toast
          const toast = new Toast(toastElement);
          toast.show();
        }
      });
    }
  }
}
