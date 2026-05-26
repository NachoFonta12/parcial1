import { Component, inject, signal } from '@angular/core';
import { UserService } from '../../services/user';
import { ChatService } from '../../services/chat-service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
    router = inject(Router);

    newMessage = '';
    isChatHidden = signal<boolean>(true);


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

    playGame(route: string) {
        this.router.navigate([route]);
    }

    toggleChat() {
        this.isChatHidden.update(value => !value);
    }
}
