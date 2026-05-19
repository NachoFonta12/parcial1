import { Component, inject } from '@angular/core';
import { StudentService } from '../../services/student';
import { DatePipe } from '@angular/common';


@Component({
    selector: 'app-who-i-am',
    imports: [DatePipe],
    templateUrl: './who-i-am.html',
    styleUrl: './who-i-am.css',
})
export class WhoIAm {
    private userService = inject(StudentService)
    student = this.userService.getStudent()

    ngOnInit(): void {
        this.userService.loadStudent();
    }

    showUser() {
        console.log(this.student());
        console.log(this.student()?.location);
        console.log(this.student()?.createdAt);
    }

}
