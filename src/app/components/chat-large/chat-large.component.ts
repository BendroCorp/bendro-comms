import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Channel, ActionCableService }  from 'angular2-actioncable';
import { Globals } from '../../globals';
import { Subscription } from 'rxjs';
import { ChatService } from '../../services/chat.service';
import { Chat } from '../../models/chat.model';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import anchorme from 'anchorme';
import { ConfirmationModal } from '../modals/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-chat-large',
  templateUrl: './chat-large.component.html',
  styleUrls: ['./chat-large.component.scss']
})

// https://www.npmjs.com/package/angular2-actioncable
export class ChatLargeComponent implements OnInit, OnDestroy {
  @ViewChild('chatElement', { static: false }) private chatContainer: ElementRef;
  @ViewChild('chatTextInput', {static: false}) private chatTextInput: ElementRef;
  channel: Channel
  chatWsSubscription: Subscription;
  chatSubscription: Subscription;
  chatText: string;
  canSendChat: boolean = false;
  editChat: Chat;
  baseUrl: string = "https://my.bendrocorp.com/";

  chats: Chat[] = [];

  constructor(private cableService: ActionCableService, 
    private chatService: ChatService, 
    private globals: Globals, 
    private authService: AuthService, 
    private confirmationModal: ConfirmationModal) { }


  @HostListener('document:keydown', ['$event'])
  someoneStartsTyping(event) {
    if (document.activeElement.id != "chatText") {
      // https://stackoverflow.com/questions/12467240/determine-if-javascript-e-keycode-is-a-printable-non-control-character
      // NOTE: This will need to be visited again if we take input from any other form
      var valid = 
        (event.keyCode > 47 && event.keyCode < 58)   || // number keys
        event.keyCode == 32   || // spacebar & not return key(s) (if you want to allow carriage returns) || event.keyCode == 13
        (event.keyCode > 64 && event.keyCode < 91)   || // letter keys
        (event.keyCode > 95 && event.keyCode < 112)  || // numpad keys
        (event.keyCode > 185 && event.keyCode < 193) || // ;=,-./` (in order)
        (event.keyCode > 218 && event.keyCode < 223);   // [\]' (in order)
      
      // if they are valid keys then give focus to the chat entry box
      if (valid) {
        this.chatTextInput.nativeElement.focus();
      }      
    }
  }

  sendChat(event) {
    // if enter is pressed
    if(event.keyCode == 13) {
      this.canSendChat = false;
      if (this.chatText && this.chatText.trim().length > 0) {
        if (this.editChat) {
          this.editChat.text = this.chatText;
        }

        let send = (this.editChat) ? this.editChat : { text: this.chatText } as Chat;
        this.chatService.sendChat(send).subscribe((chat) => {
          if (!(chat instanceof HttpErrorResponse)) {
            this.channel.send(chat);
            this.chatText = null;
            this.editChat = null;
            this.canSendChat = true;
            this.chatTextInput.nativeElement.focus();
          }
        });
      } else {
        console.log('Enter some text first...');
      }
    }

    if (event.keyCode == 27) {
      this.editChat = null;
      this.chatText = null;
    }
  }

  async deleteChat(chat: Chat) {
    if (chat && chat.id) {
      if (await this.confirmationModal.open("Are you sure you want to delete this chat?")) {
        // make sure we are not trying to edit the same message
        if (this.editChat && this.editChat.id === chat.id) {
          // if we are then stop trying to edit it
          this.editChat = null; 
          this.chatText = null;
        }

        this.chatService.deleteChat(chat).subscribe((results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.channel.send(results);
          }
        });
      }      
    }
  }

  sendChatToEdit(chat: Chat){
    this.editChat = chat;
    this.chatText = this.editChat.text;
    this.chatTextInput.nativeElement.focus();
  }

  loadChats() {
    this.chatService.list().subscribe((response) => {
      if (!(response instanceof HttpErrorResponse)) {
        this.chats = response;

        this.channel = this.cableService
          .cable(`${this.globals.wsRoot}?token=${this.authService.retrieveSession()}`)
          .channel('ChatChannel'); // , {room : 'Best Room'}

        this.channel.connected().subscribe(() => {
          console.log('Connected to chat WS channel!');
          this.canSendChat = true;
        });

        this.chatWsSubscription = this.channel.received().subscribe((chatMessage) => {
          // BUG: This is not firing off...
          console.log('Chat received from ActionCable!');
          console.log(chatMessage);
          this.chatService.notify(chatMessage);
        });

        this.chatSubscription = this.chatService.chatNotification$.subscribe((chatMessage) => {
          // What kind of thing did we do?
          if (chatMessage.mode === "CREATE") {
            // add it to the array and scroll to the bottom
            this.chats.push(chatMessage.chat);
            this.scrollChatToBottom();
          } else if (chatMessage.mode === "UPDATE")
          {
            // replace the original
            console.log('Chat update completed!');
            console.log(chatMessage.chat);
            this.chats[this.chats.findIndex(x => x.id == chatMessage.chat.id)] = chatMessage.chat;
          } else if (chatMessage.mode === "DELETE")
          {
            // remove the chat
            let index = this.chats.findIndex(x => x.id === chatMessage.chat.id)
            this.chats.splice(index, 1);
          }
        });
      }
    });
  }

  parseChatText(chatText: string): string {
    chatText = anchorme(chatText, {
      attributes:[
        {
          name:"class",
          value:"outside-link"
        },
      ]}
    );
    return chatText;
  }

  ngOnInit() {
    this.loadChats();
  }
  
  ngAfterViewChecked() {        
    this.scrollChatToBottom();        
  } 

  scrollChatToBottom(): void {
    try {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch(err) { }                 
  }

  ngOnDestroy() {
    if (this.chatWsSubscription) {
      this.chatWsSubscription.unsubscribe();
    }

    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe();
    }
  }

}
