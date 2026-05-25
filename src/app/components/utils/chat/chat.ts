import { Component, inject } from '@angular/core';
import { ChatUiService } from '../../../services/chat-ui';
import { UserService } from '../../../services/user';
import { ChatService } from '../../../services/chat-service';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-chat',
    imports: [FormsModule, DatePipe],
    templateUrl: './chat.html',
    styleUrl: './chat.css',
})

export class Chat {
  private chatUi = inject(ChatUiService);
    private userService = inject(UserService)
    user = this.userService.getUser()
    chat = inject(ChatService);

    newMessage = '';

     isChatHidden = this.chatUi.isChatHidden;

    async sendMessage() {
        const name = this.user()?.name;
        const text = this.newMessage.trim();

        console.log('nombre en ts', name)

        if (name && text) {
            await this.chat.sendMessage(name, text);
            this.newMessage = '';
        }
}
}
