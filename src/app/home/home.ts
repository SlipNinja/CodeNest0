import { Component, inject, output, OutputEmitterRef } from '@angular/core';
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
	}

	loadQuestions() {
		this.parser.getQuestions();
	}
}
