import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth";
import { inject } from "@angular/core";

export const guestGuard: CanActivateFn = async (route, state) => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const session = await auth.getActiveSession();

    if (session !== null) {
        router.navigate(['/home']);
        return false;
    }
    return true;
    
}