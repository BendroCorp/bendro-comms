import { Injectable } from '@angular/core';
import { Chat, ChatAction } from '../models/chat.model';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from './error.service';
import { MessageService } from './message.service';
import { Globals } from '../globals';
import { tap, catchError } from 'rxjs/operators';
import { StatusMessage } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient, private errorService: ErrorService, private messageService: MessageService, private globals: Globals) { }
  private chatSource = new Subject<ChatAction>();
  chatNotification$ = this.chatSource.asObservable();

  /**
   * Inform subscribers that there is a new chat message
   * @param chat A chat message
   */
  notify(chat: ChatAction) {
    this.chatSource.next(chat);
  }

  list(): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.globals.baseUrl}/chat`).pipe(
      tap(response => console.log(response)),
      catchError(this.errorService.handleError<any>('List Chats'))
    );
  }

  sendChat(chat: Chat): Observable<ChatAction> {
    if (chat.id) {
      return this.http.put<ChatAction>(`${this.globals.baseUrl}/chat`, { chat }).pipe(
        tap(response => console.log('Chat updated!')),
        catchError(this.errorService.handleError<any>('Update Chat'))
      );
    } else {
      return this.http.post<ChatAction>(`${this.globals.baseUrl}/chat`, { chat }).pipe(
        tap(response => console.log('Chat created!')),
        catchError(this.errorService.handleError<any>('Create Chat'))
      );
    }
  }

  deleteChat(chat: Chat): Observable<ChatAction> {
    return this.http.delete<ChatAction>(`${this.globals.baseUrl}/chat/${chat.id}`).pipe(
      tap(response => console.log('Chat Deleted!')),
      catchError(this.errorService.handleError<any>('Delete Chat'))
    );
  }
}
