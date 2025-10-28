import { Injectable } from '@angular/core';
import { User } from '@interfaces/user';
import { Badge } from '@interfaces/badge';

@Injectable({
	providedIn: 'root',
})
export class UserHandler {
	database_url = './assets/database.json';
	users: User[];

	async fetchUsers(): Promise<User[]> {
		const data = await fetch(this.database_url);
		const data_json = await data.json();

		return data_json['users'];
	}

	async fetchBadges(): Promise<Badge[]> {
		const data = await fetch(this.database_url);
		const data_json = await data.json();

		return data_json['badges'];
	}
}
