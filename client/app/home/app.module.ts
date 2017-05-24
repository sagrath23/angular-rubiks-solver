//Angular 2 Core Components
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';
//Angular 2 Material WebComponents
import { MaterialModule } from '@angular/material';

//Hammer.js
import 'hammerjs';

//App Main Component
import { AppComponent }  from './app.component';

//App Components
import {TrackerComponent}       from './tracker/tracker.component';
import {TrackmanagerComponent}  from './trackmanager/trackmanager.component';
import { AuthService }			from './auth/auth.service';

import { ResponseComponent } from './response/response.component';

//App routes
import { AppRoutingModule }    from './routes/app-routing.module';

@NgModule({
  	imports:[
      MaterialModule,
      BrowserModule ,
		  FormsModule ,
		  HttpModule,
    	AppRoutingModule],
  	declarations: [ AppComponent , TrackerComponent, TrackmanagerComponent, ResponseComponent ],
  	providers: [ AuthService ],
  	bootstrap:    [ AppComponent ]
})

export class AppModule { }
