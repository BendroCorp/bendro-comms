import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActionCableService, Channel } from 'angular2-actioncable';
import { Globals } from '../../globals';
import { AuthService } from '../../services/auth.service';
import * as webrtc from 'webrtc-sdk';
// import * as Pubnub from 'pubnub';

@Component({
  selector: 'app-voice-control',
  templateUrl: './voice-control.component.html',
  styleUrls: ['./voice-control.component.scss']
})
// USEFUL LINKS //
// https://blog.mgechev.com/2014/12/26/multi-user-video-conference-webrtc-angularjs-yeoman/
// https://stackblitz.com/edit/angular-webrtc
// https://www.html5rocks.com/en/tutorials/webrtc/basics/
// Muting stuff: https://groups.google.com/forum/#!topic/discuss-webrtc/ggDyBJxN4p8
// https://github.com/webrtc/apprtc/blob/master/src/web_app/js/call.js
// https://hackernoon.com/angular-pro-tip-how-to-dynamically-create-components-in-body-ba200cc289e6
// Handle multiple clients?? https://medium.com/@meetdianacheung/how-to-handle-multiple-webrtc-peer-connections-in-a-single-client-e316c452aad9

export class VoiceControlComponent implements OnInit, OnDestroy {
  peerConnection: RTCPeerConnection;
  localStream: any;
  onVoice: boolean = false;
  micClosed: boolean = false;
  muted: boolean = false;
  channel: Channel;
  senderId: string;
  wsSubscription: Subscription;

  @ViewChild("me", { static: false }) me: any;
  @ViewChild("remote", { static: false }) remote: any;

  constructor(private cableService: ActionCableService,
    private authService: AuthService,
    private globals: Globals) { }

  joinVoice() {
    // https://github.com/stephenlb/webrtc-sdk
    // let phone = webrtc.PHONE();
    // this.showRemote();
  }

  leaveVoice() {
    this.hangup();
  }

  // async setupWebRtc() {
  //   this.senderId = this.guid();
  //   // this.database.on("child_added", this.readMessage.bind(this));
  //   this.channel = this.cableService
  //         .cable(`${this.globals.wsRoot}?token=${this.authService.retrieveSession()}`)
  //         .channel('VoiceChannel');
  //   this.wsSubscription = this.channel.received().subscribe((message) => {
  //     // console.log('Chat received from ActionCable!');
  //     // console.log(chatMessage);
  //     // this.chatService.notify(chatMessage);
  //     console.log(this.peerConnection);
  //     // this.readMessage.bind(this);
  //     this.readMessage(message);
  //   });

  //   try {
  //     this.peerConnection = new RTCPeerConnection({
  //       iceServers: [
  //         { urls: "stun:stun.services.mozilla.com" },
  //         { urls: "stun:stun.l.google.com:19302" }
  //       ]
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     this.peerConnection = new RTCPeerConnection({
  //       iceServers: [
  //         { urls: "stun:stun.services.mozilla.com" },
  //         { urls: "stun:stun.l.google.com:19302" }
  //       ]
  //     });
  //   }

  //   this.peerConnection.onicecandidate = event => {
  //     event.candidate ? this.sendMessage(this.senderId, JSON.stringify({ ice: event.candidate })) : console.log("Sent All Ice");
  //   }

  //   // use ontrack -- this is where we need to add remotes and somehow keep track of all of them :/
  //   // does this even actually work right?
  //   // This will only get me two people....
  //   this.peerConnection.ontrack = event => {
  //     // need to have an element for every remote audio stream...
  //     this.remote.nativeElement.srcObject = event.streams[0]; // does this get us multiple streams or just the one??
  //   }

  //   this.showMe();

  //   return;
  // }

  // sendMessage(senderId, data) {
  //   // var msg = this.channel.push({ sender: senderId, message: data });
  //   this.channel.perform('message_relay', { sender: senderId, message: data });
  //   // msg.remove();
  // }

  // readMessage(data) {
  //   if (!data) return;
  //   try {
  //     var msg = JSON.parse(data.message);
  //     // let personalData = data.val().personalData; // what is this even for??
  //     var sender = data.sender;
  //     if (sender != this.senderId) {
  //       if (msg.ice != undefined && this.peerConnection != null) {
  //         this.peerConnection.addIceCandidate(new RTCIceCandidate(msg.ice));
  //       } else if (msg.sdp.type == "offer") {
  //         this.onVoice = true;
  //         this.peerConnection.setRemoteDescription(new RTCSessionDescription(msg.sdp))
  //           .then(() => this.peerConnection.createAnswer())
  //           .then(answer => this.peerConnection.setLocalDescription(answer))
  //           .then(() => this.sendMessage(this.senderId, JSON.stringify({ sdp: this.peerConnection.localDescription })));
  //       } else if (msg.sdp.type == "answer") {
  //         this.onVoice = true;
  //         this.peerConnection.setRemoteDescription(new RTCSessionDescription(msg.sdp));
  //       }
  //     } else {
  //       console.log('This message is from the current sender so we can relax.')
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // showMe() {
  //   navigator.mediaDevices.getUserMedia({ audio: true, video: false })
  //     .then(stream => (this.me.nativeElement.srcObject = stream))
  //     .then(stream => {
  //       // this.peerConnection.addTrack(stream, );
  //       // this.localStream = stream;
  //       // TODO: Better handling of tracks. We need to handle removing them as well
  //       stream.getTracks().forEach((track) => {
  //         this.peerConnection.addTrack(track, stream);
  //       });
  //     });
  // }

  // async showRemote() {
  //   try {
  //     if (!this.peerConnection) {
  //       await this.setupWebRtc();
  //     }
  //     this.peerConnection.createOffer()
  //       .then(offer => this.peerConnection.setLocalDescription(offer))
  //       .then(() => {
  //         this.sendMessage(this.senderId, JSON.stringify({ sdp: this.peerConnection.localDescription }));
  //         console.log(this.peerConnection);
  //         this.onVoice = true;
  //       });
  //   } catch (error) {
  //     this.setupWebRtc();
  //     console.error(error);
  //   }
  // }

  hangup() {
    // this.peerConnection.close();
    // if (this.localStream) {
    //   this.me.nativeElement.srcObject = null;
    //   let tracks = this.localStream.getTracks();
    //   for (let i = 0; i < tracks.length; i++) {
    //     tracks[i].stop();
    //   }
    // }

    // if (this.wsSubscription) {
    //   this.wsSubscription.unsubscribe();
    //   this.wsSubscription = null;
    // }

    // this.onVoice = false;
    // this.peerConnection = null;
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.leaveVoice();
  }

  guid() {
    return (this.s4() + this.s4() + "-" + this.s4() + "-" + this.s4() + "-" + this.s4() + "-" + this.s4() + this.s4() + this.s4());
  }
  s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }

}
