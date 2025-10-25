import { Component, inject } from '@angular/core';
import { DataParser } from '../services/data-parser';
import { RouterModule } from '@angular/router';
import { CourseInfo } from '../interfaces/course-info';
import { DialogHandler } from '../services/dialog-handler';

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
		this.loadQuestions();
		this.loadCourses();
	}

	async loadQuestions() {
		this.questions = await this.parser.getQuestions();
	}

	loadCourses() {
		this.course_list = this.parser.getCourses(3);
	}

	openDialog(course: CourseInfo) {
		this.dialog_handler.openDialog(course);
	}
}
