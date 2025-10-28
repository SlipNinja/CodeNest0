import { Injectable } from '@angular/core';
import { User } from '@interfaces/user';
import { Badge } from '@interfaces/badge';

@Injectable({
	providedIn: 'root',
})
export class UserHandler {
	database_url = './assets/database.json';
	users: User[] = [];

	async fetchUsers(): Promise<User[]> {
		const data = await fetch(this.database_url);
		const data_json = await data.json();

		return data_json['users'];
	}

	async fetchBadges(ids?: number[]): Promise<Badge[]> {
		const data = await fetch(this.database_url);
		const data_json = await data.json();

		// If no badge ids were given return all badges
		if (ids == undefined) return data_json['badges'];

		// Else return requested badges
		return data_json['badges'].filter((badge: Badge) => ids.includes(badge['id']));
	}
}
