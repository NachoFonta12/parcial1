import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/utils/header/header';
import { Footer } from './components/utils/footer/footer';
import { ChatUiService } from './services/chat-ui';
import { Chat } from './components/utils/chat/chat';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, Chat],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('parcial1');

  private chatUi = inject(ChatUiService);
    
    isChatHidden = this.chatUi.isChatHidden;
}
