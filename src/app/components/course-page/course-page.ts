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
import { UserHandler } from '@services/user-handler';
import { Step } from '@interfaces/step';
import { CodeHandler } from '@services/code-handler';
import { TestResponse } from '@interfaces/test-response';

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
	user_handler: UserHandler = inject(UserHandler);
	code_handler: CodeHandler = inject(CodeHandler);
	current_course: CourseInfo;
	current_step: Step;
	steps: any[] = [];
	display_logs: string[] = [];

	ngOnInit() {
		this.route_sub = this.route.params.subscribe(async (params) => {
			// Get course
			const result = await firstValueFrom(this.course_handler.get_course(params['id']));
			this.current_course = this.course_handler.check_response(result)[0];

			const id_course = this.current_course['id_course'];
			const id_user = this.user_handler.current_user()['id_user'];

			// Check if user has already started this course
			const course_taken_result = await firstValueFrom(
				this.course_handler.request_course_taken(id_user, id_course),
			);

			const course_taken_body: any = course_taken_result.body;
			let course_taken;
			let last_finished_step = 0;

			// If user already started this course, get where he stopped
			if (course_taken_body.length > 0) {
				course_taken = course_taken_body[0];
				last_finished_step = parseInt(course_taken['last_finished_step']);
			}

			// Generate visual markers for current step
			for (let i = 0; i < this.current_course['number_step']; i++) {
				const step_marker = { step_number: i + 1, done: i <= last_finished_step };
				this.steps.push(step_marker);
			}

			// Get steps for course
			const steps_result = await firstValueFrom(
				this.course_handler.request_course_step(id_course),
			);

			// Sort steps by number
			const steps_body: Step[] = steps_result.body as Step[];
			steps_body.sort((a, b) => a.number - b.number);

			// TODO: handle when last finished step is last step smhw
			this.current_step = steps_body.find((s) => s.number == last_finished_step + 1) as Step;

			console.log(this.current_course);
			console.log(this.current_step);

			// TODO: the run thing
			// TODO: update last_finished_step when code run right ( and load next step)

			this.init_editor();
		});

		document.getElementById('run_button')?.addEventListener('click', (e) => {
			this.display_logs = [];
			this.test_code().then((result: TestResponse[]) => {
				for (const r of result) {
					this.display_logs.push(r['test'], ...r['logs'], r['result_message']);
				}
			});
		});
	}

	// TODO: choose and configure extensions and remove basic setup ( nearly done )
	// TODO: improve editor style ( a bit more )
	init_editor() {
		let language;

		if (this.current_course['programming_language'] == 'js') {
			language = javascript();
		}

		let state = EditorState.create({
			extensions: [
				language || javascript(), // Language
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
		this.add_lines(20);
		// let transaction = this.view.state.update({
		// 	changes: {
		// 		from: 0,
		// 		insert: "let abc = 123;\n//J'aime les patates\nfunction please_work(a, b){\n\treturn a*b;\n}\nfunction multiply(x, y){\n\treturn please_work(y,x);\n}",
		// 	},
		// });
		// this.view.dispatch(transaction);
	}

	async test_code() {
		console.log('TEST CODE ON');
		const results = await firstValueFrom(
			this.code_handler.test_user_code(
				this.current_step,
				this.current_course['programming_language'],
				this.get_code(),
			),
		);
		const code_results = results.body as TestResponse[];
		return code_results;
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
