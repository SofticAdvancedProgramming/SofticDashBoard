import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState, HttpTransportType, LogLevel } from '@microsoft/signalr';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  private hubConnection: HubConnection;

  constructor() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${environment.ElmedaniHub}`, {
        transport: HttpTransportType.ServerSentEvents,
        logger: LogLevel.Information
      })
      .withAutomaticReconnect()
      .build();

    this.registerOnClose();
    this.registerOnReconnecting();
    this.registerOnReconnected();
  }

  public startConnection(): void {
    if (this.hubConnection.state === HubConnectionState.Disconnected) {
      this.hubConnection
        .start()
        .then(() => {
          console.log('SignalR connection started');
          this.addWasageCallbackListener((data: any) => {
            console.log("Received data:", data);
          });
        })
        .catch((err) => console.error('Error while starting SignalR connection: ' + err));
    }
  }

  public stopConnection(): void {
    if (this.hubConnection.state === HubConnectionState.Connected) {
      this.hubConnection
        .stop()
        .then(() => console.log('SignalR connection stopped'))
        .catch((err) => console.error('Error while stopping SignalR connection: ' + err));
    }
  }

  public addWasageCallbackListener(validateCallback: (data: any) => void): void {
    console.log("Adding WasageCallback listener");
    this.hubConnection.on('WasageCallback', (data) => {
      console.log("WasageCallback triggered", data);
      validateCallback(data);
    });
  }

  private registerOnClose(): void {
    this.hubConnection.onclose((error) => {
      console.error('SignalR connection closed. Error: ' + error);
    });
  }

  private registerOnReconnecting(): void {
    this.hubConnection.onreconnecting((error) => {
      console.warn('SignalR connection reconnecting. Error: ' + error);
    });
  }

  private registerOnReconnected(): void {
    this.hubConnection.onreconnected((connectionId) => {
      console.log('SignalR connection reconnected. Connection ID: ' + connectionId);
    });
  }
}
