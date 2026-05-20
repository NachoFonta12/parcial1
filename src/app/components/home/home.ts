import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user';

@Component({
    selector: 'app-home',
    imports: [],
    templateUrl: './home.html',
    styleUrl: './home.css',
})
export class Home {
    private userService = inject(UserService)
    user = this.userService.getUser()



    ngOnInit(): void {
        this.userService.loadUser();
    }
}
