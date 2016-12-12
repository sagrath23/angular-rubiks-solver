import { Component }                 from '@angular/core';
import { OnInit }                    from '@angular/core';
import { Router }    from '@angular/router';
import { Location }                  from '@angular/common';

import { User } from '../auth/user';

import { AuthService } from '../auth/auth.service';

@Component({
  moduleId: module.id,
  selector: 'login-form',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
  providers: [AuthService]			 
})

export class LoginComponent implements OnInit { 

	heroes: Hero[];

	selectedHero: Hero;

	title = 'Hero Editor';

	constructor(
    private router: Router,
    private authService: AuthService) { }

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

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.heroService.create(name)
          .then(hero => {this.heroes.push(hero);
            this.selectedHero = null;});
  }

  delete(hero: Hero): void {
    this.heroService.delete(hero.id)
      .then(() => {
        this.heroes = this.heroes.filter(h => h !== hero);
        if (this.selectedHero === hero) { this.selectedHero = null; }
      });
  }
}
