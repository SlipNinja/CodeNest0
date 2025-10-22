import { Component, inject } from '@angular/core';
import { DataParser } from '../services/data-parser';
import { RouterModule } from '@angular/router';
import { CourseDialog } from '../course-dialog/course-dialog';
import { CourseInfo } from '../interfaces/course-info';

@Component({
	selector: 'app-home',
	imports: [RouterModule, CourseDialog],
	templateUrl: './home.html',
	styleUrl: './home.scss',
})
export class Home {
	parser: DataParser = inject(DataParser);
	overview: CourseDialog = new CourseDialog();

	constructor() {
		this.loadQuestions();
		this.loadCourses();
	}

	loadQuestions() {
		this.parser.getQuestions();
	}

	loadCourses() {
		this.parser.getCourses(6);
	}

	openDialog(course: CourseInfo) {
		console.log('OPEN', this.overview);
		this.overview.display(course);
	}
}
