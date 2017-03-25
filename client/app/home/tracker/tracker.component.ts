import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { OnInit }    from '@angular/core';
import { Router }    from '@angular/router';
import { Location }  from '@angular/common';

import { Hero } from '../hero/hero';

import { HeroService } from '../hero/hero.service';

import { AuthService } from '../auth/auth.service';

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

  @Input() imageName: string;
  //instancia de la imágen que se está analizando
	img: any;
  //arreglo de colores a rastrear en la imágen
  colorsToTrack: Array<string>;
  //formas encontradas que corresponden con los filtros definidos
  shapes: Array<any> = [];
  //margen de error entre superficies encontradas
  deltaError: number = 0.1;

	tracker: any;

  result: any;

  plot: any;

	constructor(private router: Router, private authService: AuthService) {}

	ngOnInit(): void {

    tracking.ColorTracker.registerColor('blue', function(r: number, g: number, b: number) {
      if (r < 100 && g < 150 && b > 100) {
        return true;
      }
      return false;
    });

    tracking.ColorTracker.registerColor('white', function(r:number, g:number, b: number) {
      if (r > 220 && g > 220 && b > 220) {
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
    var me = this;

    console.log(me.imageName+' image loaded...');

    me.img = document.getElementById('img');

    var demoContainer = document.querySelector('.demo-container');
    //le pasamos a la librería JS un arreglo de 2 posiciones:
    //en la primera se envía el contexto de this
    //en la segunda posición se envía un arreglo de parametros para la función
    let colorsToTrack: any[] = [null,['yellow', 'white', 'blue',  'red', 'green', 'orange']];
    me.tracker = new(Function.prototype.bind.apply(tracking.ColorTracker, colorsToTrack));

    me.tracker.on('track', function(event: any) {
      event.data.forEach(function(rect: any) {
        me.shapes.push(rect);
        //analizamos las figuras encontradas
        //TODO: optimizar esto
        me.analizeShapes();
      });
    });
    tracking.track('#img', this.tracker);
  }

  analizeShapes(): void {
    var me = this;
    console.log('evaluating '+me.shapes.length+' shapes...','TrackerComponent.analizeShapes');
    for(var i in me.shapes){
      var actualShape = me.shapes[i],
          countSimils = 0;
      //se compara con los otras formas encontradas, para determinar si debe o no
      //pintarla
      for(var j in me.shapes){
        if(i != j){
          var currentShape = me.shapes[j],
              deltaW = Math.abs(currentShape.width - actualShape.width),
              deltaH = Math.abs(currentShape.height - actualShape.height),
              currentErrorW = deltaW/actualShape.width,
              currentErrorH = deltaH/actualShape.height;
          //miramos si el delta es menos a un x porciento
          if((currentErrorW <= me.deltaError) && (currentErrorH <= me.deltaError)){
            countSimils ++;
          }
        }
      }
      console.log('simils: '+countSimils,'TrackerComponent.analizeShapes');
      if(countSimils > 5){
        //debe graficarse
        me.plotRectangle(actualShape.x, actualShape.y, actualShape.width, actualShape.height, actualShape.color);
      }
    }
  }

  plotRectangle(x:number,y:number,width:number,height:number,color:string): void {
    var rect = document.createElement('div');

    document.querySelector('.demo-container').appendChild(rect);
    rect.classList.add('rect');
    rect.style.border = '4px solid ' + color;
    rect.style.width = width + 'px';
    rect.style.height = height + 'px';

    var left = (this.img.offsetLeft + x) + 'px',
        top = (this.img.offsetTop + y) + 'px';

    rect.style.left = left;
    rect.style.top = top;
  }

  resolveCube(): string {
    var me = this;

    var state = 'BR DF UR LB BD FU FL DL RD FR LU BU UBL FDR FRU BUR ULF LDF RDB DLB';
    console.log('resolve cube...');
    //enviamos el estado al back para que sea procesado y retorne los movimientos necesarios
    //para resolver
    me.authService.solveCube(state)
          .then((data) => {
            me.result = data;
            console.log(me.result);
          });

    return me.result;
  }
}
