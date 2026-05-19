import { Component, inject } from '@angular/core';
import { StudentService } from '../../services/student';

@Component({
    selector: 'app-home',
    imports: [],
    templateUrl: './home.html',
    styleUrl: './home.css',
})
export class Home {
    private userService = inject(StudentService)
    user = this.userService.getUser()

    ngOnInit(): void {
        this.userService.loadUser();
    }
}
