import { Component }                 from '@angular/core';
import { OnInit }                    from '@angular/core';
import { Router }    from '@angular/router';
import { Location }                  from '@angular/common';

import { Hero } from '../hero/hero';

import { HeroService } from '../hero/hero.service';

@Component({
  moduleId: module.id,
  selector: 'my-heroes',
  templateUrl: 'heroes.component.html',
  styleUrls: ['heroes.component.css'],
  providers: [HeroService]			 
})

export class HeroesComponent implements OnInit { 

	heroes: Hero[];

	selectedHero: Hero;

	title = 'Hero Editor';

	constructor(
    private router: Router,
    private heroService: HeroService) { }

	ngOnInit(): void {
		this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes().then(heroes => this.heroes = heroes);
  }
  	
	onSelect(hero: Hero): void {
    this.selectedHero = hero;
  }

  gotoDetail(): void {
    this.router.navigate(['/detail', this.selectedHero.id]);
  }
}
