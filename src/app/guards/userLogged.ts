import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { UserService} from "../services/user";
import { AuthService } from "../services/auth";


export const userLogged: CanActivateFn = (route, state) => {
    const userAuthenticated = inject(AuthService).isAuthenticated;
    const router = inject(Router);

    if (userAuthenticated() === false) {
        router.navigate(['/login']);
        return false;
    }
    return true;
}