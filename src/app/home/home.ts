import { Component, inject } from '@angular/core';
import { DataParser } from '../services/data-parser';

@Component({
	selector: 'app-home',
	imports: [],
	templateUrl: './home.html',
	styleUrl: './home.scss',
})
export class Home {
	parser: DataParser = inject(DataParser);

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
}
