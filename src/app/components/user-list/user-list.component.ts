import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../models/user.model';
import { ActionCableService, Channel } from 'angular2-actioncable';
import { Globals } from '../../globals';
import { AuthService } from '../../services/auth.service';
import { ConfirmationModal } from '../modals/confirmation-modal/confirmation-modal.component';
import { Subscription } from 'rxjs';
import { AppConfig } from '../../../environments/environment'
import { VoiceService } from '../../services/voice.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy {
  
  userList: User[];
  appearanceWsSubscription: Subscription;
  channel: Channel;
  baseUrl: string = "https://my.bendrocorp.com/";
  speakingSubscription: Subscription;

  constructor(private cableService: ActionCableService,
    private globals: Globals, 
    private authService: AuthService, 
    private confirmationModal: ConfirmationModal,
    private voiceService: VoiceService) { }

  ngOnInit() {
    this.channel = this.cableService
          .cable(`${this.globals.wsRoot}?token=${this.authService.retrieveSession()}`)
          .channel('AppearanceChannel');

        this.channel.connected().subscribe(() => {
          console.log('Connected to appearance WS channel!');
        });

        this.appearanceWsSubscription = this.channel.received().subscribe((userList) => {
          console.log('User list received from ActionCable!');
          console.log(userList);
          this.userList = userList;
        });
  }

  // TODO

  parseAvatar(avatarUri: string) : string {
    if (AppConfig.production) {
      return avatarUri;
    } else {
      return this.baseUrl + avatarUri;
    }
  }

  ngOnDestroy() {
    if (this.appearanceWsSubscription) {
      this.appearanceWsSubscription.unsubscribe();
    }

    if (this.speakingSubscription) {
      this.speakingSubscription.unsubscribe();
    }
  }

}
