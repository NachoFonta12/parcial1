import { inject, Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class ChatUiService {
    isChatHidden = signal<boolean>(true);

    toggleChat(){
        this.isChatHidden.update(value => !value);
    }
}