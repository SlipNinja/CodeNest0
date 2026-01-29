import { Component, inject } from '@angular/core';
import { DataParser } from '@services/data-parser';
import { RouterModule } from '@angular/router';
import { CourseInfo } from '@interfaces/course-info';
import { DialogHandler } from '@services/dialog-handler';
import { CookieService } from 'ngx-cookie-service';
import { CourseHandler } from '@services/course-handler';

@Component({
	selector: 'app-home',
	imports: [RouterModule],
	templateUrl: './home.html',
	styleUrl: './home.scss',
})
export class Home {
	dialog_handler = inject(DialogHandler);
	parser: DataParser = inject(DataParser);
	course_list: CourseInfo[] = [];
	questions: Map<string, string> = new Map();
	connected = false;

	constructor(
		private readonly cookie_service: CookieService,
		private readonly course_handler: CourseHandler,
	) {
		// If user is already connected
		const jwt_token = this.cookie_service.get('jwt_token');
		if (jwt_token) this.connected = true;

		this.loadCourses();
		this.loadQuestions();
	}

	// Load questions on homepage
	loadQuestions() {
		this.parser.getQuestions().then((result) => {
			this.questions = result;
		});
	}

	// Load courses on homepage
	loadCourses() {
		this.course_handler.get_courses().subscribe((result) => {
			let courses = this.course_handler.check_response(result);
			if (courses.length > 3) courses = courses.slice(0, 3);
			this.course_list = courses;
		});
	}

	// Open course dialog on click
	openDialog(course: CourseInfo) {
		this.dialog_handler.openDialog('course', course);
	}
}
