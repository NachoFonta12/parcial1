import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user';
import { ChatService } from '../../services/chat-service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-home',
    imports: [FormsModule],
    templateUrl: './home.html',
    styleUrl: './home.css',
})
export class Home {
    private userService = inject(UserService)
    user = this.userService.getUser()
    chat = inject(ChatService);

    newMessage = '';

    ngOnInit(): void {
        this.userService.loadUser();
    }

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
