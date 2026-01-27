import { Injectable } from '@angular/core';
import { User } from '@interfaces/user';
import { Badge } from '@interfaces/badge';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class UserHandler {
	database_url = './assets/database.json';
	request_url = 'http://localhost:3000';
	users: User[] = [];

	constructor(private http: HttpClient) {}

	// Return an observable of users
	get_users() {
		return this.http.get<User>(this.request_url + '/users');
	}

	// Return an observable of users
	add_user(email: string, password: string, username: string) {
		const add_request = `${this.request_url}/create`;
		const add_body = {
			email: email,
			password: password,
			username: username,
		};
		return this.http.post(add_request, add_body, {
			observe: 'response',
			withCredentials: true,
		});
	}

	login(email: string, password: string) {
		const login_request = `${this.request_url}/login`;
		const login_body = {
			email: email,
			password: password,
		};

		return this.http.post(login_request, login_body, { observe: 'response' });
	}

	// Fetch users
	async fetchUsers(): Promise<User[]> {
		const data = await fetch(this.database_url);
		const data_json = await data.json();

		return data_json['users'];
	}

	// Fetch badges, id list is optionnal
	async fetchBadges(ids?: number[]): Promise<Badge[]> {
		const data = await fetch(this.database_url);
		const data_json = await data.json();

		// If no badge ids were given return all badges
		if (ids == undefined) return data_json['badges'];

		// Else return requested badges
		return data_json['badges'].filter((badge: Badge) => ids.includes(badge['id']));
	}
}
