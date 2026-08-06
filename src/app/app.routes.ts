import { Routes } from '@angular/router';
import { Homepage } from './homepage/homepage';
import { Viewpdf } from './viewpdf/viewpdf';
import { Login } from './login/login';
import { AdminHome } from './admin/admin-home/admin-home';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { PublicLayout } from './layouts/public-layout/public-layout';
import { AddGrade } from './admin/add-grade/add-grade';
import { GradesList } from './admin/grades-list/grades-list';
import { EditGrade } from './admin/edit-grade/edit-grade';
import { StudentOnbooarding } from './public/student-onbooarding/student-onbooarding';

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
            },
            {
                path: 'student/onboarding',
                title: 'ORA Reading Collective - Onboarding',
                component: StudentOnbooarding,
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
            },
            {
                path: 'grades/add',
                title: 'ORA Reading Collective - Admin Add Grade',
                component: AddGrade,
            },
            {
                path: 'grades',
                title: 'ORA Reading Collective - Admin Grade List',
                component: GradesList,
            },
            { 
                path: 'grades/edit/:id',
                title: 'ORA Reading Collective - Admin Edit Grade',
                component: EditGrade 
            }
        ]
    },
    { path: '**', redirectTo: '' }
];
