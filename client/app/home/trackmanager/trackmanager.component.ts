import { Component, OnInit } from '@angular/core';

import { Hero } from '../hero/hero';
import { HeroService } from '../hero/hero.service';

import { TrackerComponent } from '../tracker/tracker.component';

@Component({
  moduleId: module.id,
  selector: 'trackmanager',
  templateUrl: 'trackmanager.component.html',
  providers: [HeroService]
})

export class TrackmanagerComponent implements OnInit {

    images: string[] = ['white','blue','red','orange','yellow','green'];

  	constructor(private heroService: HeroService) { }

  	ngOnInit(): void {
    	console.log('loaging trackers...');
  	}

}
