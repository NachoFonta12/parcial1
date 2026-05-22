import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth";
import { inject } from "@angular/core";

export const guestGuard: CanActivateFn = async (route, state) => {
    const userAuthenticated = inject(AuthService).isAuthenticated;
    const router = inject(Router);

    if (userAuthenticated() === true) {
        router.navigate(['/home']);
        return false;
    }
    return true;
    
}