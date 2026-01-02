import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../models/message.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private http = inject(HttpClient); 

  
  private apiUrl = `${environment.apiBaseUrl}/messages`;


  getMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(this.apiUrl);
  }


  sendMessage(content: string): Observable<any> {
    return this.http.post(this.apiUrl, { content });
  }
}