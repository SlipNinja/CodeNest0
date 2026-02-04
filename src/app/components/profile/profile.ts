import { Component, inject } from '@angular/core';
import { User } from '@interfaces/user';
import { DataParser } from '@services/data-parser';
import { CourseInfo } from '@interfaces/course-info';
import { DialogHandler } from '@services/dialog-handler';
import { Badge } from '@interfaces/badge';
import { UserHandler } from '@services/user-handler';
import { CourseHandler } from '@services/course-handler';
import { Router } from '@angular/router';
import { LucideAngularModule, UserRoundCog } from 'lucide-angular';

@Component({
	selector: 'app-profile',
	imports: [LucideAngularModule],
	templateUrl: './profile.html',
	styleUrl: './profile.scss',
	host: {
		'(document:click)': 'onClick($event)',
	},
})
export class Profile {
	readonly user_cog = UserRoundCog;
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

	onClick(e: any) {
		const dropdown_button = document.getElementById('toggle_dropwdown') as HTMLElement;

		// If option button clicked
		if (e.target == dropdown_button || dropdown_button.contains(e.target)) {
			this.toggle_dropwdown(e);
		} else {
			this.close_dropdown();
		}
	}

	modify_user(e: any) {
		this.router.navigate(['/profile/update']);
	}

	delete_user_dialog(e: any) {
		const warning_text = 'You are about to delete your profile. Are you sure ?';
		this.dialog_handler.openDialog('warning', warning_text);
	}

	// Open course dialog on click on last course
	openDialog(course: CourseInfo) {
		this.dialog_handler.openDialog('course', course);
	}

	toggle_dropwdown(e: MouseEvent) {
		const dropdown_content = document.getElementsByClassName(
			'dropdown_content',
		) as HTMLCollectionOf<HTMLElement>;

		if (dropdown_content[0].style.display == 'block') {
			dropdown_content[0].style.display = 'none';
		} else {
			dropdown_content[0].style.display = 'block';
		}
	}

	close_dropdown() {
		const dropdown_content = document.getElementsByClassName(
			'dropdown_content',
		) as HTMLCollectionOf<HTMLElement>;

		dropdown_content[0].style.display = 'none';
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
				this.last_course = this.user_handler.check_response(data)[0];
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
