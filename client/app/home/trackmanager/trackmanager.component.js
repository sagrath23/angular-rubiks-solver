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
    }
    TrackmanagerComponent.prototype.ngOnInit = function () {
        console.log('loading trackers...');
    };
    TrackmanagerComponent.prototype.resolveCube = function () {
        var me = this;
        //Estado objetivo UF UR UB UL DF DR DB DL FR FL BR BL UFR URB UBL ULF DRF DFL DLB DBR
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
        console.log(me.faces);
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