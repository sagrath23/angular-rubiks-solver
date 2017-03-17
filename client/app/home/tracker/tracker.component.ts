import { Component } from '@angular/core';
import { OnInit }    from '@angular/core';
import { Router }    from '@angular/router';
import { Location }  from '@angular/common';

import { Hero } from '../hero/hero';

import { HeroService } from '../hero/hero.service';

interface Tracking {
    ColorTracker: registerColor;
    track: Function;
}

interface registerColor {
    registerColor: Function;
}

declare var tracking: Tracking;

@Component({
  moduleId: module.id,
  selector: 'tracker-component',
  templateUrl: 'tracker.component.html',
  styleUrls: ['tracker.component.css'],
  providers: [HeroService]			 
})

export class TrackerComponent implements OnInit { 

	img: any;

	tracker: any;
  
  plot: any;

	constructor(private router: Router, private heroService: HeroService) {
    
  }

	ngOnInit(): void {
    /*
    var img = document.getElementById('img');
    
    var demoContainer = document.querySelector('.demo-container');

    tracking.ColorTracker.registerColor('white', function(r:number, g:number, b: number) {
      if (r > 150 && g > 150 && b > 150) {
        return true;
      }
      return false;
    });

    tracking.ColorTracker.registerColor('blue', function(r: number, g: number, b: number) {
      if (r < 100 && g < 100 && b > 110) {
        return true;
      }
      return false;
    });

    tracking.ColorTracker.registerColor('green', function(r: number, g: number, b: number) {
      if (r < 100 && g > 100 && b < 100) {
        return true;
      }
      return false;
    });

    tracking.ColorTracker.registerColor('red', function(r: number, g: number, b: number) {
      if (r > 200 && g < 50 && b < 50) {
        return true;
      }
      return false;
    });

    tracking.ColorTracker.registerColor('orange', function(r: number, g: number, b: number) {
      if (r > 120 && g > 60 && b < 70) {
        return true;
      }
      return false;
    });

    this.tracker = new tracking.ColorTracker(['yellow', 'white', 'blue',  'red', 'green']);
    
    this.tracker.on('track', function(event: any) {
      event.data.forEach(function(rect: any) {
        this.plot(rect.x, rect.y, rect.width, rect.height, rect.color);
      });
    });
    
    tracking.track('#img', this.tracker);
    
    this.plot = function(x: number, y: number, w: number, h: number, color: string) {
      var rect = document.createElement('div');
      document.querySelector('.demo-container').appendChild(rect);
      rect.classList.add('rect');
      rect.style.border = '2px solid ' + color;
      rect.style.width = w + 'px';
      rect.style.height = h + 'px';
      rect.style.left = (img.offsetLeft + x) + 'px';
      rect.style.top = (img.offsetTop + y) + 'px';
    };
    */
  }

}
