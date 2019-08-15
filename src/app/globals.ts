// globals.ts
import { Injectable } from '@angular/core';
import { AppConfig } from '../environments/environment';

@Injectable()
export class Globals {
  wsRoot: string = (AppConfig.production) ? 'wss://api.bendrocorp.com/cable' : 'ws://localhost:3000/cable';
  baseUrlRoot: string = (AppConfig.production) ? 'https://api.bendrocorp.com' : 'http://localhost:3000';
  baseAngularRoot: string = (AppConfig.production) ? 'https://my.bendrocorp.com' : 'http://localhost:4200';
  baseUrl: string = this.baseUrlRoot + '/api';  
}