import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ElectronService } from './providers/electron.service';

import { WebviewDirective } from './directives/webview.directive';

import { NgbModal, NgbModule, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { MomentModule } from 'ngx-moment';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { VoiceControlComponent } from './components/voice-control/voice-control.component';
import { ChatLargeComponent } from './components/chat-large/chat-large.component';
import { LoginComponent } from './components/login/login.component';
import { MessageComponent } from './components/message/message.component';
import { VoiceService } from './services/voice.service';
import { MessageService } from './services/message.service';
import { ErrorService } from './services/error.service';
import { AuthService } from './services/auth.service';
import { ConversationService } from './services/conversation.service';
import { ConfigService } from './services/config.service';
import { ChatService } from './services/chat.service';
import { AuthGuardService, NoAuthGuardService } from './services/auth-guard.service';
import { Globals } from './globals';
import { AuthInterceptor } from './auth.interceptor';
import { ActionCableService } from 'angular2-actioncable';
import { SafePipe } from './pipes/safe.pipe';
import { ConfirmationModal, ConfirmationModalContent } from './components/modals/confirmation-modal/confirmation-modal.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WebviewDirective,
    UserListComponent,
    VoiceControlComponent,
    ChatLargeComponent,
    LoginComponent,
    MessageComponent,
    SafePipe,
    ConfirmationModal,
    ConfirmationModalContent
  ],
  entryComponents: [
    ConfirmationModalContent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
    MomentModule
  ],
  providers: [
    Globals,
    ElectronService,
    NgbModal,
    NgbAlert,
    AuthInterceptor,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    ActionCableService,
    VoiceService,
    MessageService,
    ErrorService,
    AuthService,
    ConversationService,
    ConfigService,
    ChatService,
    AuthGuardService,
    NoAuthGuardService,
    SafePipe,
    ConfirmationModal
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
