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
import { firstValueFrom } from 'rxjs';

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
	total_xp: number;
	level: number;
	xp_next: number;
	percent_to_next: number;
	count_courses: number = 0;

	constructor() {
		this.loadUser();
		this.get_user_xp();
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

	get_user_xp() {
		this.user_handler.get_user_xp(this.user['id_user']).subscribe(async (result) => {
			const xp_response = await this.user_handler.check_response(result);
			this.total_xp = parseInt(xp_response['total_xp'] || 0);
			[this.level, this.xp_next, this.percent_to_next] = this.calculate_user_level(
				this.total_xp,
			);
			const inner_xp = document.getElementById('inner') as HTMLElement;
			if (inner_xp) {
				inner_xp.style.width = `${this.percent_to_next.toString()}%`;
			}
		});
	}

	calculate_user_level(xp: number) {
		if (!xp) xp = 0;
		let lvl_cost = 10;
		let lvl = 0;

		while (xp >= lvl_cost) {
			lvl++;
			xp -= lvl_cost;
			lvl_cost += 10;
		}

		const percent_to_next = (xp / lvl_cost) * 100;

		return [lvl, lvl_cost - xp, percent_to_next];
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
		this.count_courses_finished();
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

	async count_courses_finished() {
		const count_courses_response = await firstValueFrom(
			this.course_handler.get_courses_count_for_user(this.user['id_user']),
		);
		const count_body = this.course_handler.check_response(count_courses_response);
		this.count_courses = count_body['count'];
	}

	// Load user badges
	loadBadges() {
		// this.user_handler.fetchBadges(this.user.badges).then((result) => {
		// 	this.badges = result;
		// });
	}
}
