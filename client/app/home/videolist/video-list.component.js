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
var VideoListComponent = (function () {
    function VideoListComponent(authService, route, location) {
        this.authService = authService;
        this.route = route;
        this.location = location;
        this.title = 'Video List';
    }
    VideoListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.subscribe(function (params) {
            _this.sessionId = params['sessionId'];
            _this.getVideos();
        });
    };
    VideoListComponent.prototype.getVideos = function () {
        var _this = this;
        this.authService.getVideos(this.sessionId).then(function (videos) { return _this.videos = videos; });
    };
    return VideoListComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], VideoListComponent.prototype, "sessionId", void 0);
VideoListComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'my-videos',
        templateUrl: 'video-list.component.html',
        providers: [auth_service_1.AuthService]
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        router_1.ActivatedRoute,
        common_1.Location])
], VideoListComponent);
exports.VideoListComponent = VideoListComponent;
//# sourceMappingURL=video-list.component.js.map