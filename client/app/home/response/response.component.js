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
var router_1 = require("@angular/router");
var common_1 = require("@angular/common");
require("rxjs/add/operator/switchMap");
var auth_service_1 = require("../auth/auth.service");
var ResponseComponent = (function () {
    function ResponseComponent(authService, route, location) {
        this.authService = authService;
        this.route = route;
        this.location = location;
    }
    ResponseComponent.prototype.ngOnInit = function () {
        console.log("Mostrando respuesta");
        console.log(this.state);
    };
    ResponseComponent.prototype.goBack = function () {
        this.location.back();
    };
    return ResponseComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ResponseComponent.prototype, "state", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ResponseComponent.prototype, "response", void 0);
ResponseComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'response-component',
        templateUrl: 'response.component.html',
        providers: [auth_service_1.AuthService]
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        router_1.ActivatedRoute,
        common_1.Location])
], ResponseComponent);
exports.ResponseComponent = ResponseComponent;
//# sourceMappingURL=response.component.js.map