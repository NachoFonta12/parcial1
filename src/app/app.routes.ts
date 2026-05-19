import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Home } from './components/home/home';
import { Register } from './components/register/register';
import { WhoIAm } from './components/who-i-am/who-i-am';
import { userLogged } from './guards/userLogged';

export const routes: Routes = [
    {path: 'login', component: Login},
    {path: 'register', component: Register},
    {path: 'home', component: Home, canActivate: [userLogged]},
    {path: '', component: Home, canActivate: [userLogged]},
    {path: 'about-me', component: WhoIAm, canActivate: [userLogged]},
    {path: '****', redirectTo: 'login'}
];
