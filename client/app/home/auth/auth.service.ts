import { Injectable } 		from '@angular/core';
import { Headers, Http } 	from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { User } 	from './user';

@Injectable()
export class AuthService {

	private authUrl = 'user';  // URL to web api

	private headers = new Headers({'Content-Type': 'application/json'});

	constructor(private http: Http) { }

	private handleError(error: any): Promise<any> {
		console.error('An error occurred', error); // for demo purposes only
	    return Promise.reject(error.message || error);
	}

	login(username: string,password: string): Promise<User>{
		const url = `${this.authUrl}/auth`;
		return this.http
    				.post(this.authUrl, JSON.stringify({username: username, password: password}), {headers: this.headers})
    				.toPromise()
    				.then(res => res.json().data)
    				.catch(this.handleError);
	}

	logout(sessionId: string): Promise<User>{
		const url = `${this.authUrl}/logout`;
		return this.http
    				.post(this.authUrl, JSON.stringify({sessionId: sessionId}), {headers: this.headers})
    				.toPromise()
    				.then(res => res.json().data)
    				.catch(this.handleError);
	}
}
