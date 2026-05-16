import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user';
import { DatePipe } from '@angular/common';


@Component({
    selector: 'app-who-i-am',
    imports: [DatePipe],
    templateUrl: './who-i-am.html',
    styleUrl: './who-i-am.css',
})
export class WhoIAm {
    private userService = inject(UserService)
    user = this.userService.getUser()

    ngOnInit(): void {
        this.userService.loadUser();
    }

    showUser() {
        console.log(this.user());
        console.log(this.user()?.location);
        console.log(this.user()?.createdAt);
    }

}
