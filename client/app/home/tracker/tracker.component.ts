import { Component } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Input, Output } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Hero } from '../hero/hero';

import { HeroService } from '../hero/hero.service';

import { AuthService } from '../auth/auth.service';

// interfaces para llamado de librerías en JS
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

  readonly UP: string = 'U';
  readonly DOWN: string = 'D';
  readonly FRONT: string = 'F';
  readonly BACK: string = 'B';
  readonly LEFT: string = 'L';
  readonly RIGHT: string = 'R';
  readonly UNDEFINED: string = 'N/A';

  //  nombre de la imágen cargada
  @Input() imageName: string;

  //  instancia de la imágen que se está analizando
  img: any;
  //  arreglo de colores a rastrear en la imágen
  colorsToTrack: Array<string>;
  //  formas encontradas que corresponden con los filtros definidos
  shapes: Array<any> = [];
  // 
  cubies: Array<any> = [];
  //  margen de error entre superficies encontradas
  deltaError: number = 0.15;

  //  identificador de la cara de la imágen
  faceId: string = this.UNDEFINED;

  tracker: any;

  result: any;

  plot: any;

  @Output() returnFaceId = new EventEmitter();

  @Output() returnResponseString = new EventEmitter();

  constructor(private router: Router, private authService: AuthService) { }

  /*
  Función que se ejecuta cuando se inicializa el rastreador de colores.
  Crea los filtros de colores que debe buscar en la imágen.
  */
  ngOnInit(): void {

    tracking.ColorTracker.registerColor('blue', function (r: number, g: number, b: number) {
      if (r < 140 && g < 200 && b > 80) {
        return true;
      }
      return false;
    });

    tracking.ColorTracker.registerColor('white', function (r: number, g: number, b: number) {
      if (r > 190 && g > 190 && b > 190) {
        return true;
      }
      return false;
    });

    tracking.ColorTracker.registerColor('green', function (r: number, g: number, b: number) {
      if (r < 100 && g > 100 && b < 100) {
        return true;
      }
      return false;
    });

    tracking.ColorTracker.registerColor('red', function (r: number, g: number, b: number) {
      if (r > 150 && g < 40 && b < 70) {
        return true;
      }
      return false;
    });

    tracking.ColorTracker.registerColor('orange', function (r: number, g: number, b: number) {
      if (r > 120 && (g > 41 && g < 149) && b < 70) {
        return true;
      }
      return false;
    });

    tracking.ColorTracker.registerColor('yellow', function (r: number, g: number, b: number) {
      if (r > 150 && g > 150 && b < 50) {
        return true;
      }
      return false;
    });
  }

  /*
  Inicializa el rastreador de colores sobre la imágen.
  */
  trackColors(): void {
    let me = this;

    console.log(me.imageName + ' image loaded...');

    me.img = document.getElementById('img-' + me.imageName);

    let demoContainer = document.querySelector('.container-' + me.imageName);
    //  aplicamos un filtro para mejorar la imágen
    // tracking.Image.separableConvolve(pixels, width, height, horizWeights, vertWeights, opaque);

    // le pasamos a la librería JS un arreglo de 2 posiciones:
    // en la primera se envía el contexto de this
    // en la segunda posición se envía un arreglo de parametros para la función
    let colorsToTrack: any[] = [null, ['yellow', 'white', 'blue', 'red', 'green', 'orange']];
    me.tracker = new (Function.prototype.bind.apply(tracking.ColorTracker, colorsToTrack));

    me.tracker.on('track', function (event: any) {
      event.data.forEach(function (rect: any) {
        me.shapes.push(rect);
      });

      me.analizeShapes();

      me.clasifyShapes();
    });

    // analizamos las figuras encontradas
    tracking.track('#img-' + me.imageName, this.tracker);
  }

  /*
  Determina de las formas seleccionadas como parte del cubo cuales están a la
  izquierda, al centro y a la derecha
  */
  clasifyShapes(): void {
    let me = this,
      left: any[] = [],
      middle: any[] = [],
      right: any[] = [],
      minX = Number.MAX_VALUE,
      maxX = Number.MIN_VALUE;
    // busco el mínimo y el máximo
    for (let i = 0; i < me.cubies.length; i++) {
      if (me.cubies[i].x < minX) {
        minX = me.cubies[i].x;
      }
      if (me.cubies[i].x > maxX) {
        maxX = me.cubies[i].x;
      }
    }
    // con estos valores, clasifico los cubies a la izquierda, derecha o al medio
    for (let i = 0; i < me.cubies.length; i++) {
      let actualCubie = me.cubies[i],
        deltaXmin = Math.abs(actualCubie.x - minX),
        deltaXmax = Math.abs(actualCubie.x - maxX),
        errorXmin = (deltaXmin / (actualCubie.width)),
        errorXmax = (deltaXmax / (actualCubie.width));
      if (errorXmin <= 0.15) {
        left.push(actualCubie);
      }
      else {
        if (errorXmax <= 0.15) {// margen de error del 15% en la posicion
          right.push(actualCubie);
        }
        else {
          middle.push(actualCubie);
        }
      }
    }
    let centerIndex = me.getCenterCubie(middle);
    // despues de clasificarlas, verificamos la cara que estámos analizando
    // y retornamos los colores encontrados para que el trackmanager genere el
    // estado inicial del cubo
    me.defineCubeFace(middle[centerIndex], [left, middle, right]);
  }

  /*
  Analiza los patrones encontrados en la imágen y dibuja solo los estadisticamente
  similares
  */
  analizeShapes(): void {
    let me = this;

    for (let i in me.shapes) {
      var actualShape = me.shapes[i],
        countSimils = 0;
      // se compara con los otras formas encontradas, para determinar si debe o no
      // pintarla
      for (var j in me.shapes) {
        if (i != j) {
          var currentShape = me.shapes[j],
            deltaW = Math.abs(currentShape.width - actualShape.width),
            deltaH = Math.abs(currentShape.height - actualShape.height),
            currentErrorW = deltaW / actualShape.width,
            currentErrorH = deltaH / actualShape.height;
          // miramos si el delta es menos a un x porciento
          if ((currentErrorW <= me.deltaError) && (currentErrorH <= me.deltaError)) {
            countSimils++;
          }
        }
      }
      if (countSimils > 4) {
        // debe graficarse
        me.cubies.push(actualShape);
        me.plotRectangle(actualShape.x, actualShape.y, actualShape.width, actualShape.height, actualShape.color);
      }
    }
  }

  /*
  Dibuja el rectangulo sobre la posición en la que se encontró el patrón de color
  */
  plotRectangle(x: number, y: number, width: number, height: number, color: string): void {
    let me = this,
      rect = document.createElement('div');
    // show for debug purposes
    // rect.innerHTML += "("+x+","+y+") - "+width+"x"+height+" ";
    document.querySelector('.container-' + me.imageName).appendChild(rect);
    rect.classList.add('rect');
    rect.style.border = '4px solid ' + color;
    rect.style.width = width + 'px';
    rect.style.height = height + 'px';

    let left = (this.img.offsetLeft + x) + 'px',
      top = (this.img.offsetTop + y) + 'px';

    rect.style.left = left;
    rect.style.top = top;
  }

  /*
  obtiene el cubie central de los patrones reconocidos,
  que define la cara que estoy viendo
  */
  getCenterCubie(middleCubies: any[]): number {
    let minY = Number.MAX_VALUE,
      maxY = Number.MIN_VALUE,
      minIndex = -1,
      maxIndex = -1,
      centerIndex = -1;

    // extraemos los míninos y máximos de los cubies del medio
    for (let i = 0; i < middleCubies.length; i++) {
      if (middleCubies[i].y < minY) {
        minIndex = i;
        minY = middleCubies[i].y;
      }
      if (middleCubies[i].y > maxY) {
        maxIndex = i;
        maxY = middleCubies[i].y;
      }
    }

    // con estos valores identificados, se
    for (let i = 0; i < middleCubies.length; i++) {
      if (i !== minIndex && i !== maxIndex) {
        centerIndex = i;
        break;
      }
    }

    return centerIndex;
  }

  /*
  retorna el identificador de la cara y los colores encontrados en la cara
  */
  defineCubeFace(centerCubbie: any, allCubies: any[]): void {
    let me = this;

    switch (centerCubbie.color) {
      case 'white': {
        me.faceId = me.UP;
        me.returnFaceId.emit({ imageName: me.imageName, faceId: me.UP, cubies: allCubies });
      } break;

      case 'blue': {
        me.faceId = me.FRONT;
        me.returnFaceId.emit({ imageName: me.imageName, faceId: me.FRONT, cubies: allCubies });
      } break;

      case 'red': {
        me.faceId = me.LEFT;
        me.returnFaceId.emit({ imageName: me.imageName, faceId: me.LEFT, cubies: allCubies });
      } break;

      case 'green': {
        me.faceId = me.BACK;
        me.returnFaceId.emit({ imageName: me.imageName, faceId: me.BACK, cubies: allCubies });
      } break;

      case 'orange': {
        me.faceId = me.RIGHT;
        me.returnFaceId.emit({ imageName: me.imageName, faceId: me.RIGHT, cubies: allCubies });
      } break;

      case 'yellow': {
        me.faceId = me.DOWN;
        me.returnFaceId.emit({ imageName: me.imageName, faceId: me.DOWN, cubies: allCubies });
      } break;

      default: {
        me.faceId = me.UNDEFINED;
        me.returnFaceId.emit({ imageName: me.imageName, faceId: me.UNDEFINED, cubies: [] });
      } break;
    }
  }
}
