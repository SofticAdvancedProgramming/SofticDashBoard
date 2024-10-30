import { Injectable, Inject, PLATFORM_ID, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { getToken, Messaging, onMessage } from '@angular/fire/messaging';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  currentMessage = new BehaviorSubject<any>(null);
  countNotifications = signal(0);

  constructor(
    private _messaging: Messaging,
    @Inject(PLATFORM_ID) private platformId: Object 
  ) {}

  async getFCMToken(): Promise<string | null> {
    if (isPlatformBrowser(this.platformId)) {  
      try {
        const token = await getToken(this._messaging);
        console.log('FCM Token:', token);
        return token;  
      } catch (error) {
        console.error('Token error:', error);
        return null;  
      }
    } else {
      console.log('Not in browser environment; Firebase Messaging not initialized.');
      return null;
    }
  }

  public receiveMessageing(): void {
    if (isPlatformBrowser(this.platformId)) { 
      onMessage(this._messaging, {
        next: (payload: any) => {
          this.currentMessage.next(payload);
          this.showToast(payload.notification.title, payload.notification.body);
        },
        error: (error) => console.log('Message error:', error),
        complete: () => console.log('Done listening to messages'),
      });
    } else {
      console.log('Not in browser environment; message listener not activated.');
    }
  }

  private showToast(title: string, body: string): void {
    if (typeof window !== 'undefined') {
      import('bootstrap').then(({ Toast }) => {
        const toastElement = document.getElementById('liveToast');
        if (toastElement) {
          const toastTitleElement = toastElement.querySelector('.toast-header strong');
          const toastBodyElement = toastElement.querySelector('.toast-body');

          if (toastTitleElement) {
            toastTitleElement.textContent = title;
          }
          if (toastBodyElement) {
            toastBodyElement.textContent = body;
          }

          const toast = new Toast(toastElement);
          toast.show();
        }
      });
    }
  }
}
