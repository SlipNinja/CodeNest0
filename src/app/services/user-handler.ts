import { EventEmitter, Injectable, Output } from '@angular/core';
import { User } from '@interfaces/user';
import { Badge } from '@interfaces/badge';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root',
})
export class UserHandler {
	database_url = './assets/database.json';
	request_url = 'http://localhost:3000';
	router: Router = new Router();
	@Output() connected: EventEmitter<boolean> = new EventEmitter();

	constructor(
		private readonly http: HttpClient,
		private readonly cookie_service: CookieService,
	) {}

	// Return an observable of users
	get_users() {
		return this.http.get<User>(this.request_url + '/users');
	}

	get_user_xp(id_user: number) {
		const xp_request = `${this.request_url}/users/${id_user}/xp`;

		return this.http.get(xp_request, {
			observe: 'response',
			withCredentials: true,
		});
	}

	// Save token in cookies
	set_current_user(token: string) {
		if (this.cookie_service.check('jwt_token')) {
			this.cookie_service.delete('jwt_token');
		}
		this.cookie_service.set('jwt_token', token, {
			path: '/',
		});
	}

	process_authentification(response: any) {
		// Request not processed correctly
		const body = this.check_response(response);
		this.set_current_user(body['message']);
		this.connected.emit(true);
		this.router.navigate(['/profile']);
	}

	// Get current user data from token
	current_user() {
		const token = this.cookie_service.get('jwt_token');

		if (!token) return null;

		const token_parts: string[] = token.split('.');
		const encoded_payload: string = token_parts[1];
		const raw_payload: string = atob(encoded_payload);
		return JSON.parse(raw_payload)['user'];
	}

	// Return an add_user Observable<HttpResponse<Object>> to subscribe to
	try_add_user(email: string, password: string, username: string) {
		const add_request = `${this.request_url}/users`;
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

	// Handles user creation
	add_user(email: string, password: string, username: string) {
		this.try_add_user(email, password, username).subscribe((data) => {
			this.router.navigate(['/sign-in']);
		});
	}

	try_update_user(username: string, email: string) {
		const id_user = this.current_user()['id_user'];
		const update_request = `${this.request_url}/users/${id_user}`;
		const add_body: any = {};

		if (email != '') add_body['email'] = email;
		if (username != '') add_body['username'] = username;

		return this.http.put(update_request, add_body, {
			observe: 'response',
			withCredentials: true,
		});
	}

	update_user(username: string, email: string) {
		this.try_update_user(username, email).subscribe((data) => {
			const body = this.check_response(data);
			this.set_current_user(body);
			this.router.navigate(['/profile']);
		});
	}

	update_last_course(id_course: number) {
		const id_user = this.current_user()['id_user'];
		const update_request = `${this.request_url}/users/${id_user}/last_course/${id_course}`;
		return this.http.put(
			update_request,
			{},
			{
				observe: 'response',
				withCredentials: true,
			},
		);
	}

	// Return an login Observable<HttpResponse<Object>>  to subscribe to
	try_login(email: string, password: string) {
		const login_request = `${this.request_url}/users/login`;
		const login_body = {
			email: email,
			password: password,
		};

		return this.http.post(login_request, login_body, { observe: 'response' });
	}

	// Handles the login
	login(email: string, password: string) {
		this.try_login(email, password).subscribe((data) => {
			this.process_authentification(data);
		});
	}

	// Handles the logout
	logout(redirect: string) {
		this.cookie_service.delete('jwt_token');
		this.connected.emit(false);
		this.router.navigate([redirect]);
	}

	delete_user() {
		const user_id = this.current_user()['id_user'];
		this.try_delete(user_id).subscribe((data) => {
			this.check_response(data);
			this.logout('/');
		});
	}

	try_delete(id_user: number) {
		const delete_request = `${this.request_url}/users/${id_user}`;

		return this.http.delete(delete_request, {
			observe: 'response',
			withCredentials: true,
		});
	}

	check_response(response: HttpResponse<any>) {
		console.log(response);
		if (![200, 201, 204].includes(response.status)) {
			throw new Error(`Request failed with status ${response.status}`);
		}

		const body: any = response.body;
		if (!body && response.status != 204) {
			throw new Error(`No body found in request`);
		}

		return body;
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
