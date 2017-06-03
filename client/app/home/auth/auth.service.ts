import { Injectable } 		from '@angular/core';
import { Headers, Http } 	from '@angular/http';
import { md5 } 		from './md5';

import 'rxjs/add/operator/toPromise';

import { User } 	from './user';
import { Video } 	from '../videoplayer/video';


@Injectable()
export class AuthService {

	private authUrl = 'user';  // URL to web api
    private solverUrl = 'solver';//URL to solver API
	private videosUrl = 'videos';

	private loggedUser: User;

	private headers = new Headers({'Content-Type': 'application/json'});

	constructor(private http: Http) { }

	private handleError(error: any): Promise<any> {
		console.error('An error occurred', error); // for demo purposes only
	    return Promise.reject(error.message || error);
	}

	login(username: string,password: string): Promise<User>{
		const url = `${this.authUrl}/auth`;

		return this.http
    				.post(url, JSON.stringify({username: username, password: md5(password) }), {headers: this.headers})
    				.toPromise()
    				.then((data) => {
							this.loggedUser = data.json() as User;
							console.log(this.loggedUser,'AuthService.login.then');
							return this.loggedUser;
						}).catch(this.handleError);
	}

	logout(sessionId: string): Promise<any>{
		const url = `${this.authUrl}/logout`;
		return this.http
    				.post(this.authUrl, JSON.stringify({sessionId: sessionId}), {headers: this.headers})
    				.toPromise()
    				.then(res => res.json().data)
    				.catch(this.handleError);
	}

	getVideos(sessionId: string): Promise<Video[]>{
		const url = `${this.videosUrl}?sessionId=${sessionId}`;
		return this.http.get(url)
    				.toPromise()
    				.then(res => res.json().data as Video[])
    				.catch(this.handleError);
	}
  
  solveCube(state: string): Promise<string>{
    var me = this;
    
		const url = `${this.solverUrl}/solve`;
		
    return me.http
    				.post(url, JSON.stringify({state: state}), {headers: me.headers})
    				.toPromise()
    				.then((data) => {
              console.log(data,'AuthService.solveCube.then');
              var result = data.json() as string;
							return result;
						}).catch(this.handleError);
	}
}
