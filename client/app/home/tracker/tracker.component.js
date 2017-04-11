"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var core_2 = require('@angular/core');
var router_1 = require('@angular/router');
var hero_service_1 = require('../hero/hero.service');
var auth_service_1 = require('../auth/auth.service');
var TrackerComponent = (function () {
    function TrackerComponent(router, authService) {
        this.router = router;
        this.authService = authService;
        //formas encontradas que corresponden con los filtros definidos
        this.shapes = [];
        //
        this.cubies = [];
        //margen de error entre superficies encontradas
        this.deltaError = 0.1;
    }
    TrackerComponent.prototype.ngOnInit = function () {
        tracking.ColorTracker.registerColor('blue', function (r, g, b) {
            if (r < 140 && g < 200 && b > 80) {
                return true;
            }
            return false;
        });
        tracking.ColorTracker.registerColor('white', function (r, g, b) {
            if (r > 190 && g > 190 && b > 190) {
                return true;
            }
            return false;
        });
        tracking.ColorTracker.registerColor('green', function (r, g, b) {
            if (r < 100 && g > 100 && b < 100) {
                return true;
            }
            return false;
        });
        tracking.ColorTracker.registerColor('red', function (r, g, b) {
            if (r > 150 && g < 40 && b < 70) {
                return true;
            }
            return false;
        });
        tracking.ColorTracker.registerColor('orange', function (r, g, b) {
            if (r > 120 && (g > 41 && g < 149) && b < 70) {
                return true;
            }
            return false;
        });
        tracking.ColorTracker.registerColor('yellow', function (r, g, b) {
            if (r > 150 && g > 150 && b < 50) {
                return true;
            }
            return false;
        });
    };
    TrackerComponent.prototype.trackColors = function () {
        var me = this;
        console.log(me.imageName + ' image loaded...');
        me.img = document.getElementById('img-' + me.imageName);
        var demoContainer = document.querySelector('.container-' + me.imageName);
        //aplicamos un filtro para mejorar la imágen
        //tracking.Image.separableConvolve(pixels, width, height, horizWeights, vertWeights, opaque);
        //le pasamos a la librería JS un arreglo de 2 posiciones:
        //en la primera se envía el contexto de this
        //en la segunda posición se envía un arreglo de parametros para la función
        var colorsToTrack = [null, ['yellow', 'white', 'blue', 'red', 'green', 'orange']];
        me.tracker = new (Function.prototype.bind.apply(tracking.ColorTracker, colorsToTrack));
        me.tracker.on('track', function (event) {
            event.data.forEach(function (rect) {
                me.shapes.push(rect);
            });
            me.analizeShapes();
            me.clasifyShapes();
        });
        //analizamos las figuras encontradas
        tracking.track('#img-' + me.imageName, this.tracker);
    };
    TrackerComponent.prototype.clasifyShapes = function () {
        var me = this, left = [], middle = [], right = [], minX = Number.MAX_VALUE, maxX = Number.MIN_VALUE;
        //busco el mínimo y el máximo
        for (var i = 0; i < me.cubies.length; i++) {
            if (me.cubies[i].x < minX) {
                minX = me.cubies[i].x;
            }
            if (me.cubies[i].x > maxX) {
                maxX = me.cubies[i].x;
            }
        }
        //con estos valores, clasifico los cubies a la izquierda, derecha o al medio
        for (var i = 0; i < me.cubies.length; i++) {
            var actualCubie = me.cubies[i], deltaXmin = Math.abs(actualCubie.x - minX), deltaXmax = Math.abs(actualCubie.x - maxX), errorXmin = (deltaXmin / (actualCubie.width)), errorXmax = (deltaXmax / (actualCubie.width));
            if (errorXmin <= 0.15) {
                left.push(actualCubie);
            }
            else {
                if (errorXmax <= 0.15) {
                    right.push(actualCubie);
                }
                else {
                    middle.push(actualCubie);
                }
            }
        }
        console.log(left[me.getLeftTopCubie(left)]);
    };
    TrackerComponent.prototype.analizeShapes = function () {
        var me = this;
        for (var i in me.shapes) {
            var actualShape = me.shapes[i], countSimils = 0;
            //se compara con los otras formas encontradas, para determinar si debe o no
            //pintarla
            for (var j in me.shapes) {
                if (i != j) {
                    var currentShape = me.shapes[j], deltaW = Math.abs(currentShape.width - actualShape.width), deltaH = Math.abs(currentShape.height - actualShape.height), currentErrorW = deltaW / actualShape.width, currentErrorH = deltaH / actualShape.height;
                    //miramos si el delta es menos a un x porciento
                    if ((currentErrorW <= me.deltaError) && (currentErrorH <= me.deltaError)) {
                        countSimils++;
                    }
                }
            }
            if (countSimils > 4) {
                //debe graficarse
                me.cubies.push(actualShape);
                me.plotRectangle(actualShape.x, actualShape.y, actualShape.width, actualShape.height, actualShape.color);
            }
        }
    };
    TrackerComponent.prototype.plotRectangle = function (x, y, width, height, color) {
        var me = this, rect = document.createElement('div');
        rect.innerHTML += "(" + x + "," + y + ") - " + width + "x" + height + " ";
        document.querySelector('.container-' + me.imageName).appendChild(rect);
        rect.classList.add('rect');
        rect.style.border = '4px solid ' + color;
        rect.style.width = width + 'px';
        rect.style.height = height + 'px';
        var left = (this.img.offsetLeft + x) + 'px', top = (this.img.offsetTop + y) + 'px';
        rect.style.left = left;
        rect.style.top = top;
    };
    TrackerComponent.prototype.getLeftTopCubie = function (leftCubies) {
        var me = this, leftTopIndex = 0, minY = Number.MAX_VALUE;
        for (var i = 0; i < leftCubies.length; i++) {
            if (leftCubies[i].y < minY) {
                leftTopIndex = i;
                minY = leftCubies[i].y;
            }
        }
        return leftTopIndex;
    };
    TrackerComponent.prototype.getRightTopCubie = function () {
        var me = this, leftTopIndex = 0;
        return leftTopIndex;
    };
    TrackerComponent.prototype.getLeftBottomCubie = function () {
        var me = this, leftBottomIndex = 0;
        return leftBottomIndex;
    };
    TrackerComponent.prototype.getRightBottomCubie = function () {
        var me = this, leftBottomIndex = 0;
        return leftBottomIndex;
    };
    TrackerComponent.prototype.getCenterCubie = function (leftTopIndex, leftBottomIndex, rightTopIndex, rightBottomIndex) {
        var me = this, leftBottomIndex = 0;
        return leftBottomIndex;
    };
    __decorate([
        core_2.Input(), 
        __metadata('design:type', String)
    ], TrackerComponent.prototype, "imageName", void 0);
    TrackerComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'tracker-component',
            templateUrl: 'tracker.component.html',
            styleUrls: ['tracker.component.css'],
            providers: [hero_service_1.HeroService]
        }), 
        __metadata('design:paramtypes', [router_1.Router, auth_service_1.AuthService])
    ], TrackerComponent);
    return TrackerComponent;
}());
exports.TrackerComponent = TrackerComponent;
//# sourceMappingURL=tracker.component.js.map