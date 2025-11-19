import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { basicSetup } from 'codemirror';
import { EditorView } from '@codemirror/view';
import { DataParser } from '@services/data-parser';
import { CourseInfo } from '@interfaces/course-info';

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
	step_quantity: boolean[] = [true, false, false, false, false]; // TO CHANGE
	parser: DataParser = inject(DataParser);
	current_course: CourseInfo;

	ngOnInit(): void {
		this.route_sub = this.route.params.subscribe((params) => {
			console.log('Loading course with id', params['id']);
			this.parser.fetchCourse(params['id']).then((course) => {
				this.current_course = course;
			});
		});

		this.view = new EditorView({
			extensions: [basicSetup],
		});

		document.querySelector('#code_zone')?.appendChild(this.view.dom);

		this.add_lines(10);
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
