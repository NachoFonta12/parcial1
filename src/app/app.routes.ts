import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Home } from './components/home/home';
import { Register } from './components/register/register';
import { WhoIAm } from './components/who-i-am/who-i-am';
import { userGuard } from './guards/userGuard';
import { guestGuard } from './guards/GuestGuard';
import { userLogged } from './resolvers/userLogged';

export const routes: Routes = [
    {path: 'login', component: Login, canActivate: [guestGuard]},
    {path: 'register', component: Register, canActivate: [guestGuard]},
    {path: 'home', component: Home, canActivate: [userGuard], resolve: {user: userLogged}},
    {path: '', component: Home, canActivate: [userGuard], resolve: {user: userLogged}},
    {path: 'about-me', component: WhoIAm, canActivate: [userGuard], resolve: {user: userLogged}},
    {path: '****', redirectTo: 'login'}
];
