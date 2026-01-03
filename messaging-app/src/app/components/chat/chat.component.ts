import { Component, OnInit, OnDestroy, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MessageService } from '../../services/message.service';
import { Message } from '../../models/message.model';


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit, OnDestroy {

  private messageService = inject(MessageService);
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  

  messages: Message[] = [];
  newMessage: string = '';
 private messagesSub!: Subscription;

ngOnInit() {
    this.messageService.startConnection();
    this.messageService.getMessages();

    this.messagesSub = this.messageService.messages$.subscribe(msgs => {
      this.messages = msgs; 
      setTimeout(() => this.scrollToBottom(), 50);
    });
  }

ngOnDestroy() {
    this.messageService.stopConnection();
    
    if (this.messagesSub) {
      this.messagesSub.unsubscribe();
    }
  }
  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) { }                 
  }

  send() {
    if (!this.newMessage.trim()) return;

    this.messageService.sendMessage(this.newMessage).subscribe({
      next: () => {
        this.newMessage = '';
      },
      error: (err) => console.error('Error sending message', err)
    });
  }
}