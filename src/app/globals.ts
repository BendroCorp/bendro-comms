// globals.ts
import { Injectable } from '@angular/core';
import { AppConfig } from '../environments/environment';

@Injectable()
export class Globals {
  forceProduction: boolean = true;

  readonly wsRoot: string = (AppConfig.production || this.forceProduction) ? 'wss://api.bendrocorp.com/cable' : 'ws://localhost:3000/cable';
  readonly baseUrlRoot: string = (AppConfig.production || this.forceProduction) ? 'https://api.bendrocorp.com' : 'http://localhost:3000';
  readonly baseAngularRoot: string = (AppConfig.production || this.forceProduction) ? 'https://my.bendrocorp.com' : 'http://localhost:4200';
  readonly baseUrl: string = this.baseUrlRoot + '/api';
}
