import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatLargeComponent } from './chat-large.component';

describe('ChatLargeComponent', () => {
  let component: ChatLargeComponent;
  let fixture: ComponentFixture<ChatLargeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatLargeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatLargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
