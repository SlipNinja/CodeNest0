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
import { Router } from '@angular/router';

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
	router: Router = new Router();
	view: EditorView;
	parser: DataParser = inject(DataParser);
	user_handler: UserHandler = inject(UserHandler);
	code_handler: CodeHandler = inject(CodeHandler);
	current_course: CourseInfo;
	current_step: Step;
	steps: Step[];
	is_last_step: boolean = false;
	display_steps: any[] = [];
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
			let last_finished_step = 0;

			// If user already started this course, get where he stopped
			if (course_taken_body.length > 0) {
				const course_taken = course_taken_body[0];
				last_finished_step = parseInt(course_taken['last_finished_step']);
			}

			// Get steps from course
			const steps_result = await firstValueFrom(
				this.course_handler.request_course_step(id_course),
			);

			// Sort steps by number
			this.steps = steps_result.body as Step[];
			this.steps.sort((a, b) => a.number - b.number);

			// Init codemirror editor
			this.init_editor();

			// Update current step
			this.update_step(last_finished_step);
		});

		document.getElementById('run_button')?.addEventListener('click', (e) => {
			this.display_logs = [];
			this.test_code().then((result: TestResponse[]) => {
				for (const r of result) {
					this.display_logs.push(r['test'], ...r['logs'], r['result_message']);
				}
			});
		});

		document.getElementById('next_button')?.addEventListener('click', async (e) => {
			const id_course = this.current_course['id_course'];
			const id_user = this.user_handler.current_user()['id_user'];
			const new_last_finished = this.current_step['number'];

			// If course over
			if (this.current_course['number_step'] <= new_last_finished) {
				this.router.navigate(['/course-list']);
				return;
			}

			await firstValueFrom(
				this.course_handler.update_course_taken(id_user, id_course, new_last_finished),
			);
			this.update_step(new_last_finished);
		});
	}

	update_step(last_finished: number) {
		this.display_steps = [];

		// Update step display
		for (let i = 0; i < this.current_course['number_step']; i++) {
			const step_marker = { step_number: i + 1, done: i <= last_finished };
			this.display_steps.push(step_marker);
		}

		// Check if it is the last step
		if (last_finished + 1 == this.current_course['number_step']) {
			this.is_last_step = true;
		}

		// Update current step
		this.current_step = this.steps.find((s) => s.number == last_finished + 1) as Step;

		// Reset editor
		this.reset_editor();
	}

	// Initialize codemirror editor
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
	}

	// Clear codemirror content
	reset_editor() {
		this.view.dispatch({
			changes: { from: 0, to: this.view.state.doc.toString().length, insert: '' },
		});

		this.add_lines(20);
	}

	async test_code() {
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
