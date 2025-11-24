import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { basicSetup } from 'codemirror';
import { EditorView } from '@codemirror/view';
import { DataParser } from '@services/data-parser';
import { CourseInfo } from '@interfaces/course-info';
import { javascript } from '@codemirror/lang-javascript';

@Component({
	selector: 'app-course-page',
	imports: [],
	templateUrl: './course-page.html',
	styleUrl: './course-page.scss',
})
export class CoursePage implements OnInit, OnDestroy {
	private route_sub: Subscription;
	private readonly route = inject(ActivatedRoute);
	view: EditorView;
	parser: DataParser = inject(DataParser);
	current_course: CourseInfo;

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

	ngOnInit(): void {
		this.route_sub = this.route.params.subscribe((params) => {
			this.parser.fetchCourse(params['id']).then((course) => {
				this.current_course = course;
			});
		});

		this.init_editor();

		window.addEventListener('message', (e) => {
			const results = JSON.parse(e.data);
			console.log(results);
		});

		const data = {
			f_name: this.example_exercice['f_name'],
			tests: this.example_exercice['tests'],
			code: this.get_code(),
		};

		document.getElementById('run_button')?.addEventListener('click', (e) => {
			this.send_iframe(data);
		});
	}

	init_editor() {
		this.view = new EditorView({
			extensions: [basicSetup, this.example_exercice['lang']],
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

	send_iframe(data: object) {
		const game_frame = document.getElementsByTagName('iframe')[0];

		// const iframe_origin = new URL(game_frame.src).origin;
		// console.log(iframe_origin);

		game_frame.contentWindow?.postMessage(data, '*');
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
