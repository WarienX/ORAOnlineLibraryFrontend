import { Routes } from '@angular/router';
import { Homepage } from './homepage/homepage';
import { Viewpdf } from './viewpdf/viewpdf';
import { Login } from './login/login';
import { AdminHome } from './admin/admin-home/admin-home';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { PublicLayout } from './layouts/public-layout/public-layout';

export const routes: Routes = [
    {
        path: '',
        title: 'ORA Reading Collective',
        component: PublicLayout,
        children: [
            {
                path: '',
                title: 'ORA Reading Collective - Homepage',
                component: Homepage,
            }
        ]
    },{
        path: 'login',
        title: 'ORA Reading Collective - Login',
        component: Login,
    },{
        path: 'admin',
        component: AdminLayout,
        children: [
            {
                path: 'home',
                title: 'ORA Reading Collective - Admin Home',
                component: AdminHome,
            }
        ]
    },
    { path: '**', redirectTo: '' }
];
