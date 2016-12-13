import { Injectable } 		from '@angular/core';
import { Headers, Http } 	from '@angular/http';
import { Md5 } 		from '../../../../node_modules/ts-md5/dist/md5';

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
		console.log(url);
		return this.http
    				.post(url, JSON.stringify({username: username, password: Md5.hashStr(password) }), {headers: this.headers})
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
