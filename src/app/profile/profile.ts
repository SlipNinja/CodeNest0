import { Component, inject } from '@angular/core';
import { User } from '../interfaces/user';
import { DataParser } from '../services/data-parser';
import { CourseInfo } from '../interfaces/course-info';
import { DialogHandler } from '../services/dialog-handler';
import { Badge } from '../interfaces/badge';

@Component({
	selector: 'app-profile',
	imports: [],
	templateUrl: './profile.html',
	styleUrl: './profile.scss',
})
export class Profile {
	dialog_handler = inject(DialogHandler);
	parser = inject(DataParser);
	last_course: CourseInfo;

	user: User = {
		id: 1,
		firstname: 'Jean',
		lastname: 'Neymar',
		username: 'Brice-de-Nice',
		email: 'papaoutay@pasla.com',
		password: 'turlututu',
		courses_completed: [1, 2],
		xp: 123,
		last_course: 3,
		profile_photo: './assets/imgs/empty_profile.png',
		badges: [],
	};

	badge: Badge = {
		id: 1,
		name: 'Good start !',
		description: 'Obtained for completing your first course',
		logo: './assets/badges/1.png',
	};

	constructor() {
		this.last_course = this.parser.getCourse(this.user['last_course']) as CourseInfo;
	}

	openDialog(course: CourseInfo) {
		this.dialog_handler.openDialog(course);
	}
}
