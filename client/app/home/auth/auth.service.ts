import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

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

	getUsers(): Promise<User[]> {
	    return this.http.get(this.authUrl)
	    			.toPromise()
	    			.then(response => response.json().data as User[])
	    			.catch(this.handleError);
	}

	getUser(id: number): Promise<User> {
  		const url = `${this.authUrl}/${id}`;
  		return this.http.get(url)
    				.toPromise()
    				.then(response => response.json().data as User)
    				.catch(this.handleError);
	}

	update(hero: User): Promise<User> {
  		const url = `${this.authUrl}/${hero.id}`;
  		return this.http.put(url, JSON.stringify(hero), {headers: this.headers})
    				.toPromise()
    				.then(() => hero)
    				.catch(this.handleError);
	}

	create(name: string): Promise<User> {
  		return this.http
    				.post(this.authUrl, JSON.stringify({name: name}), {headers: this.headers})
    				.toPromise()
    				.then(res => res.json().data)
    				.catch(this.handleError);
	}

	delete(id: number): Promise<void> {
  		const url = `${this.authUrl}/${id}`;
  		return this.http.delete(url, {headers: this.headers})
    				.toPromise()
    				.then(() => null)
    				.catch(this.handleError);
	}
}