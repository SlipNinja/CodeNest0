import { Component } from '@angular/core';
import { User } from '../interfaces/user';

@Component({
	selector: 'app-profile',
	imports: [],
	templateUrl: './profile.html',
	styleUrl: './profile.scss',
})
export class Profile {
	user: User = {
		id: 1,
		firstname: 'Jean',
		lastname: 'Neymar',
		username: 'Brice-de-Nice',
		email: 'papaoutay@pasla.com',
		password: 'turlututu',
		courses_complete: [1, 2],
		xp: 123,
		last_course: 3,
	};
}
