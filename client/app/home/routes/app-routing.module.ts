    import { NgModule }             from '@angular/core';
    import { RouterModule, Routes } from '@angular/router';

    import { LoginComponent }       from '../login/login.component';
    import { VideoListComponent }   from '../videolist/video-list.component';

    const routes: Routes = [
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      { path: 'login',  component: LoginComponent },
      { path: 'videolist/:sessionId',  component: VideoListComponent }//,
      //{ path: 'detail/:id', component: HeroDetailComponent },
      //{ path: 'heroes',     component: HeroesComponent }
    ];

    @NgModule({
      imports: [ RouterModule.forRoot(routes) ],
      exports: [ RouterModule ]
    })

    export class AppRoutingModule {}
