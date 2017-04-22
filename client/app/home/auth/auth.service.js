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
var http_1 = require("@angular/http");
var md5_1 = require("./md5");
require("rxjs/add/operator/toPromise");
var AuthService = (function () {
    function AuthService(http) {
        this.http = http;
        this.authUrl = 'user'; // URL to web api
        this.solverUrl = 'solver'; //URL to solver API
        this.videosUrl = 'videos';
        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
    }
    AuthService.prototype.handleError = function (error) {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    };
    AuthService.prototype.login = function (username, password) {
        var _this = this;
        var url = this.authUrl + "/auth";
        return this.http
            .post(url, JSON.stringify({ username: username, password: md5_1.md5(password) }), { headers: this.headers })
            .toPromise()
            .then(function (data) {
            _this.loggedUser = data.json();
            console.log(_this.loggedUser, 'AuthService.login.then');
            return _this.loggedUser;
        }).catch(this.handleError);
    };
    AuthService.prototype.logout = function (sessionId) {
        var url = this.authUrl + "/logout";
        return this.http
            .post(this.authUrl, JSON.stringify({ sessionId: sessionId }), { headers: this.headers })
            .toPromise()
            .then(function (res) { return res.json().data; })
            .catch(this.handleError);
    };
    AuthService.prototype.getVideos = function (sessionId) {
        var url = this.videosUrl + "?sessionId=" + sessionId;
        return this.http.get(url)
            .toPromise()
            .then(function (res) { return res.json().data; })
            .catch(this.handleError);
    };
    AuthService.prototype.solveCube = function (state) {
        var me = this;
        var url = this.solverUrl + "/solve";
        return me.http
            .post(url, JSON.stringify({ state: state }), { headers: me.headers })
            .toPromise()
            .then(function (data) {
            console.log(data, 'AuthService.solveCube.then');
            var result = data.json();
            return result;
        }).catch(this.handleError);
    };
    return AuthService;
}());
AuthService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map