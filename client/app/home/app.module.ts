//Angular 2 Core Components
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';

//App Main Component
import { AppComponent }  from './app.component';

//App Components
import { LoginComponent } 	   from './login/login.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';
import { HeroesComponent }     from './heroes/heroes.component';
import { DashboardComponent }  from './dashboard/dashboard.component';
import { HeroService }         from './hero/hero.service';

//App routes
import { AppRoutingModule }    from './routes/app-routing.module';

// Imports for loading & configuring the in-memory web api
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService }  from './in-memory-data.service';

@NgModule({
  	imports:[ 
  		BrowserModule , 
		FormsModule ,
		HttpModule,
    	InMemoryWebApiModule.forRoot(InMemoryDataService),
    	AppRoutingModule],  
  	declarations: [ AppComponent , LoginComponent, DashboardComponent, HeroesComponent , HeroDetailComponent ],
  	providers: [ HeroService ], 
  	bootstrap:    [ AppComponent ]
})

export class AppModule { }
