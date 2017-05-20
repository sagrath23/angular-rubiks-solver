import { Component, Input, OnInit } from '@angular/core';

import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';

import 'rxjs/add/operator/switchMap';

import { AuthService } from '../auth/auth.service';
import { Hero } from '../hero/hero';

@Component({
  moduleId: module.id,
  selector: 'response',
  templateUrl: 'response.component.html',
  providers: [AuthService]
})

export class ResponseComponent implements OnInit {

	@Input()
	hero: Hero;

	constructor(private heroService: HeroService, 
		private route: ActivatedRoute, 
		private location: Location) {}

	ngOnInit(): void {
  		this.route.params.switchMap((params: Params) => this.heroService.getHero(+params['id'])).subscribe(hero => this.hero = hero);
	}

	goBack(): void {
  		this.location.back();
	}

	save(): void {
  		this.heroService.update(this.hero)
    			.then(() => this.goBack());	
	}	
}