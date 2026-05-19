import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Home } from './components/home/home';
import { Register } from './components/register/register';
import { WhoIAm } from './components/who-i-am/who-i-am';

export const routes: Routes = [
    {path: 'login', component: Login},
    {path: 'register', component: Register},
    {path: 'home', component: Home},
    {path: '', component: Home},
    {path: 'about-me', component: WhoIAm},
    {path: '****', redirectTo: 'login'}
];
