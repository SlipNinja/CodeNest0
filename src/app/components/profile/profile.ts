import { Component, inject } from '@angular/core';
import { User } from '@interfaces/user';
import { DataParser } from '@services/data-parser';
import { CourseInfo } from '@interfaces/course-info';
import { DialogHandler } from '@services/dialog-handler';
import { Badge } from '@interfaces/badge';
import { UserHandler } from '@services/user-handler';

@Component({
	selector: 'app-profile',
	imports: [],
	templateUrl: './profile.html',
	styleUrl: './profile.scss',
})
export class Profile {
	dialog_handler = inject(DialogHandler);
	user_handler = inject(UserHandler);
	parser = inject(DataParser);

	last_course: CourseInfo;
	user: User;
	badges: Badge[] = [];

	constructor() {
		this.loadUser();
	}

	// Open course dialog on click on last course
	openDialog(course: CourseInfo) {
		this.dialog_handler.openDialog('course', course);
	}

	// Load user data (TODO: Handle authentification)
	loadUser() {
		this.user_handler.fetchUsers().then((result) => {
			this.user = result[0];
			this.loadLastCourse();
			this.loadBadges();
		});
	}

	// Load last course done by user
	loadLastCourse() {
		this.parser.fetchCourse(this.user['last_course']).then((result) => {
			this.last_course = result;
		});
	}

	// Load user badges
	loadBadges() {
		this.user_handler.fetchBadges(this.user.badges).then((result) => {
			this.badges = result;
		});
	}
}
