import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService, NoAuthGuardService } from './services/auth-guard.service';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [NoAuthGuardService]
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
