import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom, Subscription } from 'rxjs';
import { minimalSetup } from 'codemirror';
import { dropCursor, EditorView, lineNumbers } from '@codemirror/view';
import { DataParser } from '@services/data-parser';
import { CourseInfo } from '@interfaces/course-info';
import { javascript } from '@codemirror/lang-javascript';
import { EditorState } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import { bracketMatching, foldGutter, indentOnInput, indentUnit } from '@codemirror/language';
import { autocompletion, closeBrackets } from '@codemirror/autocomplete';
import { CourseHandler } from '@services/course-handler';

@Component({
	selector: 'app-course-page',
	imports: [],
	templateUrl: './course-page.html',
	styleUrl: './course-page.scss',
})
export class CoursePage implements OnInit, OnDestroy {
	private route_sub: Subscription;
	private readonly route = inject(ActivatedRoute);
	private readonly course_handler = inject(CourseHandler);
	view: EditorView;
	parser: DataParser = inject(DataParser);
	current_course: CourseInfo;
	game_frame: HTMLIFrameElement;

	step_quantity = [
		{ step_number: 1, done: true },
		{ step_number: 2, done: true },
		{ step_number: 3, done: false },
		{ step_number: 4, done: false },
		{ step_number: 5, done: false },
	]; // TO CHANGE

	example_exercice: any = {
		lang: javascript(),
		f_name: 'multiply',
		text: "Write a function named 'multiply' that takes two parameters and returns the product of them.",
		tests: [
			{
				f_params: [5, 5],
				f_result: 25,
			},
			{
				f_params: [5, 0],
				f_result: 0,
			},
			{
				f_params: [234, 12],
				f_result: 2808,
			},
		],
	};

	ngOnInit() {
		this.route_sub = this.route.params.subscribe(async (params) => {
			const result = await firstValueFrom(this.course_handler.get_course(params['id']));
			this.current_course = this.course_handler.check_response(result)[0];

			console.log(this.current_course);
			// TODO: Check if user has already started this course
			// TODO: If not, create the record in course_taken and load 1st step
			// TODO: If yes, load the next step

			const exercise_text = document.getElementById('exercise');
			if (exercise_text) exercise_text.textContent = this.example_exercice['text'];
		});

		this.game_frame = document.getElementsByTagName('iframe')[0];
		this.init_editor();

		// window.addEventListener('message', (e) => {
		// 	// Verify it's from the sandboxed iframe
		// 	if (e.origin === null && e.source === this.game_frame.contentWindow) return;

		// 	const results = e.data;
		// 	console.log(results);
		// });

		document.getElementById('run_button')?.addEventListener('click', (e) => {
			//this.send_iframe();
			this.test_code();
		});
	}

	// TODO: choose and configure extensions and remove basic setup ( nearly done )
	// TODO: improve editor style ( a bit more )
	init_editor() {
		let state = EditorState.create({
			extensions: [
				this.example_exercice['lang'], // Language
				EditorState.tabSize.of(4), // Tab size
				minimalSetup,
				oneDark, // Theme
				lineNumbers(), // Creates line number gutter
				foldGutter(), // Allows to fold gutters
				dropCursor(), // Cursor on drag and drop
				indentOnInput(), // Auto indent semantically
				bracketMatching(), // Highlight opposing bracket
				closeBrackets(), // Add closing bracket after cursor
				autocompletion(), // Semantic autocompletion
				indentUnit.of('    '), // Default size of indentation
			],
		});
		this.view = new EditorView({
			state,
		});
		document.querySelector('#code_zone')?.appendChild(this.view.dom);
		this.add_lines(10);
		let transaction = this.view.state.update({
			changes: {
				from: 0,
				insert: "let abc = 123;\n//J'aime les patates\nfunction please_work(a, b){\n\treturn a*b;\n}\nfunction multiply(x, y){\n\treturn please_work(y,x);\n}",
			},
		});
		this.view.dispatch(transaction);
	}

	send_iframe() {
		if (!this.game_frame.contentWindow) {
			console.error('Game frame not found');
			return;
		}
		const data = {
			f_name: this.example_exercice['f_name'],
			tests: this.example_exercice['tests'],
			code: this.get_code(),
		};
		// Sandboxed iframes which lack the 'allow-same-origin' header
		// don't have an origin which you can target
		this.game_frame.contentWindow.postMessage(data, '*');
	}

	test_code() {
		console.log('TEST CODE ON');
		//new VM().run('console.log("JE SUIS DANS UNE VM OMG");');
	}

	get_code() {
		return this.view.state.doc.toString();
	}

	add_lines(n: number) {
		let transaction = this.view.state.update({
			changes: { from: 0, insert: '\n'.repeat(n) },
		});
		this.view.dispatch(transaction);
	}

	ngOnDestroy() {
		this.route_sub.unsubscribe();
	}
}
