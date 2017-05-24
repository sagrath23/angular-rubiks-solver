    import { NgModule }               from '@angular/core';
    import { RouterModule, Routes }   from '@angular/router';

    import { TrackerComponent }       from '../tracker/tracker.component';
    import { TrackmanagerComponent }  from '../trackmanager/trackmanager.component';
    import { ResponseComponent }     from '../response/response.component';

    const routes: Routes = [
      { path: '', redirectTo: '/track', pathMatch: 'full' },
      { path: 'track',  component: TrackmanagerComponent }/*,
      { path: 'response/:state/:response',  component: ResponseComponent }*/
    ];

    @NgModule({
      imports: [ RouterModule.forRoot(routes) ],
      exports: [ RouterModule ]
    })

    export class AppRoutingModule {}
