import { Component, inject } from '@angular/core';
import { User } from '@interfaces/user';
import { DataParser } from '@services/data-parser';
import { CourseInfo } from '@interfaces/course-info';
import { DialogHandler } from '@services/dialog-handler';
import { Badge } from '@interfaces/badge';
import { UserHandler } from '@services/user-handler';
import { CourseHandler } from '@services/course-handler';
import { Router } from '@angular/router';

@Component({
	selector: 'app-profile',
	imports: [],
	templateUrl: './profile.html',
	styleUrl: './profile.scss',
})
export class Profile {
	dialog_handler = inject(DialogHandler);
	user_handler = inject(UserHandler);
	course_handler = inject(CourseHandler);
	parser = inject(DataParser);

	last_course: CourseInfo;
	user: User;
	badges: Badge[] = [];
	router: Router = new Router();

	constructor() {
		this.loadUser();
	}

	// Open course dialog on click on last course
	openDialog(course: CourseInfo) {
		this.dialog_handler.openDialog('course', course);
	}

	loadUser() {
		const current_user = this.user_handler.current_user();
		console.log(current_user);

		if (!current_user) {
			this.router.navigate(['/sign-in']);
			return;
		}

		this.user = current_user;

		this.loadLastCourse();
		// 	this.loadBadges();
	}

	// Load last course done by user
	loadLastCourse() {
		if (this.user['id_last_course']) {
			this.course_handler.get_course(this.user['id_last_course']).subscribe((data) => {
				if (data.status != 200) throw new Error('Cant create a ne user');
				else {
					const body: any = data.body;
					if (!body) throw new Error('No body found in response');
					this.last_course = body[0];
				}
			});
		}
	}

	// Load user badges
	loadBadges() {
		// this.user_handler.fetchBadges(this.user.badges).then((result) => {
		// 	this.badges = result;
		// });
	}
}
