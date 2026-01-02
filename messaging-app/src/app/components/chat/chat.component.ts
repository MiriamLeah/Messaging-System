import { Component, OnInit, OnDestroy, inject, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../services/message.service';
import { Message } from '../../models/message.model';


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit, OnDestroy ,AfterViewChecked {

  private messageService = inject(MessageService);
@ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  messages: Message[] = [];
  newMessage: string = '';
  intervalId: any; 

  ngOnInit() {
 
    this.loadMessages();

   
    this.intervalId = setInterval(() => {
      this.loadMessages();
    }, 3000);
  }


  ngAfterViewChecked() {        
    this.scrollToBottom();        
  } 

  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) { }                 
  }

  ngOnDestroy() {
   
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  loadMessages() {
    this.messageService.getMessages().subscribe({
      next: (data) => {
        this.messages = data;
      },
      error: (err) => {
        console.error('Error fetching messages', err);
      }
    });
  }

  send() {
 
    if (!this.newMessage.trim()) return;

    this.messageService.sendMessage(this.newMessage).subscribe({
      next: () => {
        this.newMessage = '';
        this.loadMessages(); 
      },
      error: (err) => console.error('Error sending message', err)
    });
  }
}