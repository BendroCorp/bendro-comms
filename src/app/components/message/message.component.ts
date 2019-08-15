import { Component, OnInit } from '@angular/core';
import { Subscription, Subject, Observable, of } from 'rxjs';
import { debounceTime, map, timeout } from 'rxjs/operators';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { TimeSpan } from 'ng-timespan';
import { MessageService } from '../../services/message.service';
import { Message } from '../../models/message.model';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  animations: [
    trigger('flyInOut', [
      state('in', style({transform: 'translateX(0)'})),
      transition('void => *', [
        style({transform: 'translateX(-100%)'}),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({transform: 'translateX(100%)'}))
      ])
    ])
  ]
})
export class MessageComponent implements OnInit {
  capturedMessage: Message;

  constructor(private messageService: MessageService){
    this.subscription = messageService.messageAnnounced$.subscribe(
      called => {
        this.capturedMessage = this.messageService.messages[0]
        if (this.capturedMessage.type === 1) {
          this.changeSuccessMessage(this.capturedMessage.message)
        } 
        else if(this.capturedMessage.type === 2) {
          this.changeErrorMessage(this.capturedMessage.message)
        } 
        else if(this.capturedMessage.type === 3)
        {
          this.changeInfoMessage(this.capturedMessage.message)
        }else if(this.capturedMessage.type === 4)
        {
          this.changeUpdateMessage(this.capturedMessage.message)
        }else if (this.capturedMessage.type === 5)
        {
          this.changeStaticInfoMessage(this.capturedMessage.message)
        }
        this.messageService.clear();
      }
    )
  }

  private subscription:Subscription; // for the message service 
  private _successMessage = new Subject<string>();
  private _errorMessage = new Subject<string>();
  private _infoMessage = new Subject<string>(); 
  private _staticInfoMessage = new Subject<string>(); 
  private _updateMessage = new Subject<string>();
  successMessage: string;
  infoMessage: string;
  staticInfoMessage: string;
  errorMessage: string;
  updateMessage: string;

  ngOnInit(): void { 
    // success message
    this._successMessage.subscribe((message) => {
      this.successMessage = message
      setTimeout(() => {
            this.successMessage = null;
      }, 5000);
    });
    
    // Error message
    this._errorMessage.subscribe((message) => {
      this.errorMessage = message
      setTimeout(() => {
        this.errorMessage = null;
      }, 10000);
    });

    // Info message
    this._infoMessage.subscribe((message) => {
      this.infoMessage = message
      setTimeout(() => {
        this.infoMessage = null;
      }, 7000);
    });

    this._staticInfoMessage.subscribe((message) => {
      this.staticInfoMessage = message
      // these dont time out
    })

    this._updateMessage.subscribe((message) => {
      this.updateMessage = message
      // these dont time out
    })
  }

  changeSuccessMessage(message:string) {
    this._successMessage.next(message);
  }

  changeErrorMessage(message:string) {
    this._errorMessage.next(message);
  }

  changeInfoMessage(message:string) {
    this._infoMessage.next(message);
  }

  changeUpdateMessage(message:string) {
    this._updateMessage.next(message);
  }

  changeStaticInfoMessage(message:string) {
    this._staticInfoMessage.next(message);
  }

  doUpdate()
  {
    this.messageService.doUpdate()
  }

}
