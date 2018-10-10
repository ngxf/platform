import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-chat-view',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatViewComponent {}
