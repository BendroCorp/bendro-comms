import { Component, HostListener } from '@angular/core';
import { ElectronService } from './providers/electron.service';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';
import { shell } from 'electron';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public electronService: ElectronService,
    private translate: TranslateService) {

    translate.setDefaultLang('en');
    console.log('AppConfig', AppConfig);

    if (electronService.isElectron()) {
      console.log('Mode electron');
      console.log('Electron ipcRenderer', electronService.ipcRenderer);
      console.log('NodeJS childProcess', electronService.childProcess);
    } else {
      console.log('Mode web');
    }
  }

  // grand masters of anchor click listeners
  @HostListener('document:click', ['$event'])
  hrefClickInChatText(event) {
    if (this.electronService.isElectron()) {      
      if (event.path && event.path[0] && event.path[0].className === 'outside-link') {
        event.preventDefault();
        shell.openExternal(event.path[0].href);
      } else if (event.path && event.path[0] && event.path[0].nodeName === 'A') {
        event.preventDefault();
      }
    } else {
      if (event.path && event.path[0] && event.path[0].nodeName === 'A') {
        window.open(event.path[0].href)
      }
    }    
  }
}
