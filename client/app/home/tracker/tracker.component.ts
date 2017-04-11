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
    Image: Image;
    track: Function;
}

interface registerColor {
    registerColor: Function;
}

interface Image {
    separableConvolve: Function;
    verticalConvolve: Function;
    horizontalConvolve: Function;
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
  //
  cubies: Array<any> = [];
  //margen de error entre superficies encontradas
  deltaError: number = 0.1;

	tracker: any;

  result: any;

  plot: any;

	constructor(private router: Router, private authService: AuthService) {}

	ngOnInit(): void {

    tracking.ColorTracker.registerColor('blue', function(r: number, g: number, b: number) {
      if (r < 140 && g < 200 && b > 80) {
        return true;
      }
      return false;
    });

    tracking.ColorTracker.registerColor('white', function(r:number, g:number, b: number) {
      if (r > 190 && g > 190 && b > 190) {
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

    me.img = document.getElementById('img-'+me.imageName);

    var demoContainer = document.querySelector('.container-'+me.imageName);
    //aplicamos un filtro para mejorar la imágen
    //tracking.Image.separableConvolve(pixels, width, height, horizWeights, vertWeights, opaque);

    //le pasamos a la librería JS un arreglo de 2 posiciones:
    //en la primera se envía el contexto de this
    //en la segunda posición se envía un arreglo de parametros para la función
    let colorsToTrack: any[] = [null,['yellow', 'white', 'blue',  'red', 'green', 'orange']];
    me.tracker = new(Function.prototype.bind.apply(tracking.ColorTracker, colorsToTrack));

    me.tracker.on('track', function(event: any) {
      event.data.forEach(function(rect: any) {
        me.shapes.push(rect);
      });

      me.analizeShapes();

      me.clasifyShapes();
    });


    //analizamos las figuras encontradas
    tracking.track('#img-'+me.imageName, this.tracker);
  }

  clasifyShapes():void{
    var me = this,
        left = [],
        middle = [],
        right = [],
        minX = Number.MAX_VALUE,
        maxX = Number.MIN_VALUE;
    //busco el mínimo y el máximo
    for(var i =0; i < me.cubies.length; i++){
      if(me.cubies[i].x < minX){
        minX = me.cubies[i].x;
      }
      if(me.cubies[i].x > maxX){
        maxX = me.cubies[i].x;
      }
    }
    console.log("minX = "+ minX);
    console.log("maxX = "+ maxX);
    //con estos valores, clasifico los cubies a la izquierda, derecha o al medio
    for(var i =0; i < me.cubies.length; i++){
      var actualCubie = me.cubies[i],
          deltaXmin = Math.abs(actualCubie.x - minX),
          deltaXmax = Math.abs(actualCubie.x - maxX),
          errorXmin = (deltaXmin /(actualCubie.width)),
          errorXmax = (deltaXmax /(actualCubie.width));
          console.log(me.imageName+" error minx= "+errorXmin+" error maxx= "+errorXmax);
      if(errorXmin <= 0.15){
        left.push(actualCubie);
      }
      else{
        if(errorXmax <= 0.15){
          right.push(actualCubie);
        }
        else{
          middle.push(actualCubie);
        }
      }
    }

    console.log(left,middle,right);

  }

  analizeShapes(): void {
    var me = this;

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
      if(countSimils > 4){
        //debe graficarse
        me.cubies.push(actualShape);
        me.plotRectangle(actualShape.x, actualShape.y, actualShape.width, actualShape.height, actualShape.color);
      }
    }
  }

  plotRectangle(x:number,y:number,width:number,height:number,color:string): void {
    var me = this,
        rect = document.createElement('div');

    rect.innerHTML += "("+x+","+y+") - "+width+"x"+height+" ";
    document.querySelector('.container-'+me.imageName).appendChild(rect);
    rect.classList.add('rect');
    rect.style.border = '4px solid ' + color;
    rect.style.width = width + 'px';
    rect.style.height = height + 'px';

    var left = (this.img.offsetLeft + x) + 'px',
        top = (this.img.offsetTop + y) + 'px';

    rect.style.left = left;
    rect.style.top = top;
  }

  defineCubies():void{
    var me = this,
        leftTopIndex = me.getLeftTopCubie();
        console.log(me.cubies);
        console.log(me.imageName+' - leftTopIndex: '+leftTopIndex);
  }

  getLeftTopCubie(): number{
    var me = this,
        leftTopIndex = 0,
        minX = Number.MAX_VALUE;
    if(me.cubies.length === 9){
      //busco el cubie que esté más a la izquierda
      for(var i = 0; i < me.cubies.length; i++){
        if(i != leftTopIndex){
          var actualCubie = me.cubies[i],
              ltCubie = me.cubies[leftTopIndex],
              //lo mejor es clasificarlos apenas se detecte si es un cubie, que lo mande
              //a la izquierda, a la derecha o al medio
              deltaMin = Math.abs(actualCubie.x - minX),
              error = deltaMin / ((ltCubie.width + actualCubie.width)/2);
          console.log('color: - '+actualCubie.color+' actCubie - x: '+actualCubie.x +' - '+'actCubie - y: '+actualCubie.y);
          console.log('color: - '+ltCubie.color+' ltCubie - x: '+ltCubie.x+' - '+'ltCubie - y: '+ltCubie.y);
          console.log('delta: '+ deltaMin);
          console.log('error: '+ error);

          if(error <= 0.1){
            //verificamos el valor de y
            if(actualCubie.y < ltCubie.y){
              console.log('change '+leftTopIndex+' por '+i);
              leftTopIndex = i;
              minX = actualCubie.x;
            }
          }
        }
      }

      return leftTopIndex;
    }
    else{
      return -1;
    }
  }

  getRightTopCubie(): number{
    var me = this,
        leftTopIndex = 0;

    return leftTopIndex;
  }

  getLeftBottomCubie(): number{
    var me = this,
        leftBottomIndex = 0;

    return leftBottomIndex;
  }

  getRightBottomCubie(): number{
    var me = this,
        leftBottomIndex = 0;

    return leftBottomIndex;
  }

  getCenterCubie(leftTopIndex:number,leftBottomIndex:number,rightTopIndex:number,rightBottomIndex:number): number{
    var me = this,
        leftBottomIndex = 0;

    return leftBottomIndex;
  }
}
