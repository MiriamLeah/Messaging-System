import { Injectable, inject } from '@angular/core';
import { HttpClient , HttpParams} from '@angular/common/http';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'; 
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Message } from '../models/message.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private http = inject(HttpClient); 
  private authService = inject(AuthService);
  
  private apiUrl = `${environment.apiBaseUrl}/messages`;
  private hubUrl = `${environment.hubUrl}/chatHub`;

  private messagesSubject = new BehaviorSubject<Message[]>([]);
  public messages$ = this.messagesSubject.asObservable(); 
  private hubConnection!: HubConnection;

  public async startConnection(): Promise<void> {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        accessTokenFactory: () => this.authService.getToken() || '' 
      })
      .withAutomaticReconnect()
      .build();

    try {
      await this.hubConnection.start();
      console.log('SignalR Connected');
    } catch (err) {
      console.error('SignalR Error: ', err);
    }

    
    this.hubConnection.on('ReceiveMessage', (message: Message) => {
      const currentMessages = this.messagesSubject.value;
      this.messagesSubject.next([...currentMessages, message]);
    });
  }

    
  


  getMessages(): void {
  this.http.get<Message[]>(this.apiUrl).subscribe({
    next: (msgs) => {
      this.messagesSubject.next(msgs);
    },
    error: (err) => {
      console.error('Failed to load messages', err);
    }
  });
}

  sendMessage(content: string): Observable<any> {
    return this.http.post(this.apiUrl, { content });
  }

 

  public stopConnection() {
    if (this.hubConnection) this.hubConnection.stop();
  }
}