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
	step_quantity = [
		{ step_number: 1, done: true },
		{ step_number: 2, done: true },
		{ step_number: 3, done: false },
		{ step_number: 4, done: false },
		{ step_number: 5, done: false },
	]; // TO CHANGE
	parser: DataParser = inject(DataParser);
	current_course: CourseInfo;

	ngOnInit(): void {
		this.route_sub = this.route.params.subscribe((params) => {
			console.log('Loading course with id', params['id']);
			this.parser.fetchCourse(params['id']).then((course) => {
				this.current_course = course;
			});
		});

		this.init_editor();

		window.addEventListener('message', (e) => {
			console.log(e.data);
		});

		document.getElementById('run_button')?.addEventListener('click', (e) => {
			this.send_iframe(this.get_code());
		});
	}

	init_editor() {
		this.view = new EditorView({
			extensions: [basicSetup, javascript()],
		});

		document.querySelector('#code_zone')?.appendChild(this.view.dom);
		this.add_lines(10);

		let transaction = this.view.state.update({
			changes: { from: 0, insert: 'console.log("COUCOU");\n//J\'aime les patates\n' },
		});
		this.view.dispatch(transaction);
	}

	send_iframe(data: string) {
		const game_frame = document.getElementsByTagName('iframe')[0];
		const iframe_origin = new URL(game_frame.src).origin;
		console.log(iframe_origin);
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
