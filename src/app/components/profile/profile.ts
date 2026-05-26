import { Component, inject, signal } from '@angular/core';
import { UserService } from '../../services/user';
import { GameService } from '../../services/game';
import { ProfileService } from '../../services/profile';
import { HangedService } from '../../services/hanged';

@Component({
    selector: 'app-profile',
    imports: [],
    templateUrl: './profile.html',
    styleUrl: './profile.css',
})
export class Profile {
    userService = inject(UserService);
    user = this.userService.getUser()
    gameService = inject(GameService);
    profileService = inject(ProfileService);
    hangedService = inject(HangedService);
    leaderboards = this.profileService.leaderboards;


    ngOnInit() {
        this.profileService.getScoresAllGames();
    }

    formatTime(time: number | string): string {
        return this.hangedService.formatTime(Number(time));
    }


}
