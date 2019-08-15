import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceControlComponent } from './voice-control.component';

describe('VoiceControlComponent', () => {
  let component: VoiceControlComponent;
  let fixture: ComponentFixture<VoiceControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoiceControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoiceControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
