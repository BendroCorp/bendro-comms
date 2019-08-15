import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Message } from '../models/message.model';
// import { SwUpdate } from '@angular/service-worker';

@Injectable()
export class MessageService {
  messages: Message[] = []; 

  constructor () { } // NOTE - this may cause trouble private update: SwUpdate

  // Observable string streams
  private messageSource = new Subject();
  messageAnnounced$ = this.messageSource.asObservable();
  refreshData()
  { 
    this.messageSource.next();
  }

  addSuccess(message: string)
  {
    let msg:Message = { message: message, type: 1 }
    this.add(msg)
  }

  addError(message: string)
  {
    let msg:Message = { message: message, type: 2 }
    console.error(message)
    this.add(msg)
  }

  addInfo(message: string)
  {
    let msg:Message = { message: message, type: 3 }
    console.log(message)
    this.add(msg)
  }

  addStaticInfo(message: string)
  {
    let msg:Message = { message: message, type: 5 }
    console.log(message)
    this.add(msg)
  }

  addUpdateMessage(message: string)
  {
    let msg:Message = { message: message, type: 4 }
    this.add(msg)
  }

  doUpdate()
  {
    // this.update.activateUpdate().then(() => document.location.reload())
  }

  add(message: Message) {
    this.messages.push(message);
    this.refreshData();
  }

  clear() {
    this.messages = [];
  }
}