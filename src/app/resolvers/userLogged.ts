import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { AuthService } from "../services/auth";
import { User } from "../models/user.model";
import { UserService } from "../services/user";

export const userLogged: ResolveFn<User | null> = (route) => {
    const userAuthenticated = inject(AuthService).isAuthenticated;
    const userService = inject(UserService);    
    if (userAuthenticated() === false) {
        return null;
    }
    return userService.getUser()();
}