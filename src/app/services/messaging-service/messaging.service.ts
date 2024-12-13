import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { getToken, Messaging, onMessage } from '@angular/fire/messaging';
 import { LocalStorageService } from '../local-storage-service/local-storage.service';
import { UserService } from '../user/user-service';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  currentMessage = new BehaviorSubject<any>(null);
  public countNotifications = signal(0);

  constructor(
    private localStorageService: LocalStorageService,
    private _messaging: Messaging,
    private userService: UserService,
  ) { 
   
  }

  async getFCMToken(): Promise<string | null> {
    if (this.localStorageService.isBrowser()) {
      try {
        const token = await getToken(this._messaging);
        console.log('FCM Token:', token);
        return token;
      } catch (error) {
        console.error('Error getting FCM Token:', error);
        return null;
      }
    }
    return null; // Return null if not in a browser environment
  }

  public receiveMessaging(): void {
    if (this.localStorageService.isBrowser()) {
      if (!this._messaging) {
        console.error('Firebase Messaging instance is null!');
        return;
      }
  
      try {
        onMessage(this._messaging, {
          next: (payload: any) => {
            this.countNotification();
            this.currentMessage.next(payload);
            this.showToast(payload.notification.title, payload.notification.body);
          },
          error: (error) => console.error('Error receiving message:', error),
          complete: () => console.log('Done listening for messages')
        });
      } catch (error) {
        console.error('Error in onMessage setup:', error);
      }
    }
  }

  countNotification() {
    const userId = Number(this.localStorageService.getItem('userId'));
    const companyId = Number(this.localStorageService.getItem('companyId'));
    this.userService.countNotification({ companyId, employeeId: userId }).subscribe((res) => {
      this.localStorageService.setItem('countNotifications', res.data);
      this.countNotifications.set(res.data);
    });
  }

  showToast(title: string, body: string) {
    if (this.localStorageService.isBrowser()) {
      import('bootstrap').then(({ Toast }) => {
        const toastElement = document.getElementById('liveToast');
        if (toastElement) {
          // Update title and body dynamically
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
      }).catch(error => {
        console.error('Error loading Bootstrap Toast:', error);
      });
    }
  }
}
