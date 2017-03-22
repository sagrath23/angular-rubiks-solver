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

  colorsToTrack: Array<string>;

	tracker: any;

  plot: any;

	constructor(private router: Router, private heroService: HeroService) {

  }

	ngOnInit(): void {
    console.log('init tracker...');

    tracking.ColorTracker.registerColor('blue', function(r: number, g: number, b: number) {
      if (r < 100 && g < 100 && b > 110) {
        return true;
      }
      return false;
    });

    tracking.ColorTracker.registerColor('white', function(r:number, g:number, b: number) {
      if (r > 120 && g > 120 && b > 80) {
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
      if (r > 150 && g < 40 && b < 70) {
        return true;
      }
      return false;
    });

    tracking.ColorTracker.registerColor('orange', function(r: number, g: number, b: number) {
      if (r > 120 && (g > 41 && g < 149) && b < 70) {
        return true;
      }
      return false;
    });

    tracking.ColorTracker.registerColor('yellow', function(r: number, g: number, b: number) {
      if (r > 150 && g > 150 && b < 50) {
        return true;
      }
      return false;
    });
  }

  trackColors(): void{
    console.log('image loaded...');
    var me = this;

    me.img = document.getElementById('img');

    var demoContainer = document.querySelector('.demo-container');
    //le pasamos a la librería JS un arreglo de 2 posiciones:
    //en la primera se envía el contexto de this
    //en la segunda posición se envía un arreglo de parametros para la función
    let colorsToTrack: any[] = [null,['yellow', 'white', 'blue',  'red', 'green', 'orange']];
    me.tracker = new(Function.prototype.bind.apply(tracking.ColorTracker, colorsToTrack));

    me.tracker.on('track', function(event: any) {
      event.data.forEach(function(rect: any) {
        console.log('color tracked!!!');
        //this.plot(rect.x, rect.y, rect.width, rect.height, rect.color);
        console.log(rect);
        me.plotRectangle(rect.x, rect.y, rect.width, rect.height, rect.color);
      });
    });

    tracking.track('#img', this.tracker);
  }

  plotRectangle(x:number,y:number,width:number,height:number,color:string): void {
    console.log('Plotting '+color+' rectangle');
    var rect = document.createElement('div');
    document.querySelector('.demo-container').appendChild(rect);
    rect.classList.add('rect');
    rect.style.border = '2px solid ' + color;
    rect.style.width = width + 'px';
    rect.style.height = height + 'px';
    console.log(this.img.offsetLeft,'Offset left');
    console.log(this.img.offsetTop,'Offset top');
    var left = (this.img.offsetLeft + x) + 'px',
        top = (this.img.offsetTop + y) + 'px';
    console.log('left '+left);
    console.log('top '+top);
    rect.style.left = left;
    rect.style.top = top;
  }
}
