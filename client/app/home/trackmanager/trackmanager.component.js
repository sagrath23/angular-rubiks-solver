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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var auth_service_1 = require("../auth/auth.service");
var TrackmanagerComponent = (function () {
    function TrackmanagerComponent(authService) {
        this.authService = authService;
        this.images = ['white', 'blue', 'red', 'orange', 'yellow', 'green'];
        //images: string[] = ['blue'];
        this.faces = new Array(6);
        this.cubies = new Array(6);
    }
    TrackmanagerComponent.prototype.ngOnInit = function () {
        console.log('loading trackers...');
    };
    /*
    
    //Estado objetivo
    UF = Blanco-azul
    UR = Blanco-naranja
    UB = Blanco-verde
    UL = Blanco-rojo
    DF = Amarillo-azul
    DR = Amarillo-naranja
    DB = Amarillo-verde
    DL = Amarillo-rojo
    FR = Azul-naranja
    FL = Azul-rojo
    BR = Verde-naranja
    BL = Verde-rojo
    UFR = Blanco-azul-naranja
    URB = Blanco-naranja-verde
    UBL = Blanco-verde-rojo
    ULF = Blanco-rojo-azul
    DRF = Amarillo-naranja-azul
    DFL = Amarillo-azul-rojo
    DLB = Amarillo-rojo-verde
    DBR = Amarillo-verde-naranja
     */
    TrackmanagerComponent.prototype.resolveCube = function () {
        var me = this;
        //Estado objetivo UF UR UB UL DF DR DB DL FR FL BR BL UFR URB UBL ULF DRF DFL DLB DBR
        //estado actual : DB UF FR FL UR DF BL UB RB UR DL DR UFL FDR RDB RDB FRU DFL URB UBL
        var state = 'BR DF UR LB BD FU FL DL RD FR LU BU UBL FDR FRU BUR ULF LDF RDB DLB';
        //enviamos el estado al back para que sea procesado y retorne los movimientos necesarios
        //para resolver
        me.authService.solveCube(state)
            .then(function (data) {
            me.result = data;
            console.log(me.result);
        });
        return me.result;
    };
    TrackmanagerComponent.prototype.setFaceId = function (event) {
        var me = this;
        me.faces[me.images.indexOf(event.imageName)] = event.faceId;
        me.cubies[me.images.indexOf(event.imageName)] = event.cubies;
        if (me.check()) {
            me.findUpCross();
        }
    };
    TrackmanagerComponent.prototype.check = function () {
        var me = this;
        for (var i = 0; i < me.faces.length; i++) {
            if (me.faces[i] === null) {
                return false;
            }
        }
        return true;
    };
    /*
    función que identifica qué cubies están en las posiciones UF,UR,UL,UB
     */
    TrackmanagerComponent.prototype.findUpCross = function () {
        var me = this, upFaceIndex = -1, frontFaceIndex = -1, leftFaceIndex = -1, rightFaceIndex = -1, backFaceIndex = -1;
        //busco la cara de arriba
        for (var i = 0; i < me.faces.length; i++) {
            if (me.faces[i] === 'U') {
                upFaceIndex = i;
            }
            if (me.faces[i] === 'F') {
                frontFaceIndex = i;
            }
            if (me.faces[i] === 'L') {
                leftFaceIndex = i;
            }
            if (me.faces[i] === 'R') {
                rightFaceIndex = i;
            }
            if (me.faces[i] === 'B') {
                leftFaceIndex = i;
            }
        }
        //ahora, procedemos a identificar las caras de los cubies que están en las posiciones
        //de la cara superior
    };
    return TrackmanagerComponent;
}());
TrackmanagerComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'trackmanager',
        templateUrl: 'trackmanager.component.html',
        providers: [auth_service_1.AuthService]
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], TrackmanagerComponent);
exports.TrackmanagerComponent = TrackmanagerComponent;
//# sourceMappingURL=trackmanager.component.js.map