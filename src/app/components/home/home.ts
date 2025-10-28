import { Component, inject } from '@angular/core';
import { DataParser } from '@services/data-parser';
import { RouterModule } from '@angular/router';
import { CourseInfo } from '@interfaces/course-info';
import { DialogHandler } from '@services/dialog-handler';

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

	constructor() {
		this.loadCourses();
		this.loadQuestions();
	}

	loadQuestions() {
		this.parser.getQuestions().then((result) => {
			this.questions = result;
		});
	}

	loadCourses() {
		this.parser.fetchCourses(3).then((result) => {
			this.course_list = result;
		});
	}

	openDialog(course: CourseInfo) {
		this.dialog_handler.openDialog('course', course);
	}
}
