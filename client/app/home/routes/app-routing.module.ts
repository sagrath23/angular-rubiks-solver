    import { NgModule }             from '@angular/core';
    import { RouterModule, Routes } from '@angular/router';

    import { LoginComponent }   from '../login/login.component';

    const routes: Routes = [
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      { path: 'login',  component: LoginComponent }//,
      //{ path: 'detail/:id', component: HeroDetailComponent },
      //{ path: 'heroes',     component: HeroesComponent }
    ];

    @NgModule({
      imports: [ RouterModule.forRoot(routes) ],
      exports: [ RouterModule ]
    })

    export class AppRoutingModule {}