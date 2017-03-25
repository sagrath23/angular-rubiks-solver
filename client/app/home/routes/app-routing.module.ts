    import { NgModule }               from '@angular/core';
    import { RouterModule, Routes }   from '@angular/router';

    import { LoginComponent }         from '../login/login.component';

    import { TrackerComponent }       from '../tracker/tracker.component';
    import { TrackmanagerComponent }  from '../trackmanager/trackmanager.component';
    import { VideoListComponent }     from '../videolist/video-list.component';

    const routes: Routes = [
      { path: '', redirectTo: '/track', pathMatch: 'full' },
      { path: 'track',  component: TrackmanagerComponent }
    ];

    @NgModule({
      imports: [ RouterModule.forRoot(routes) ],
      exports: [ RouterModule ]
    })

    export class AppRoutingModule {}
