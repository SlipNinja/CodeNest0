import { Component, inject } from '@angular/core';
import { CourseInfo } from '../interfaces/course-info';
import { DataParser } from '../services/data-parser';
import { RouterModule } from '@angular/router';
import { DialogHandler } from '../services/dialog-handler';

@Component({
	selector: 'app-course-list',
	imports: [RouterModule],
	templateUrl: './course-list.html',
	styleUrl: './course-list.scss',
})
export class CourseList {
	dialog_handler = inject(DialogHandler);
	parser: DataParser = inject(DataParser);
	course_list: CourseInfo[] = [];
	filtered_list: CourseInfo[] = [];
	sortTags: { [key: string]: number } = {};
	display_tags: string[] = [];
	filters: string[] = [];
	total_tags: number = -1;

	constructor() {
		this.course_list = this.parser.getCourses();
		this.loadTags();
		this.filterCourses();
	}

	// Populate filtered courses based on filters
	filterCourses() {
		this.filtered_list = this.course_list.filter((course) =>
			this.filters.find((filter) => course['tags'].includes(filter))
		);
	}

	// Called on checkbox change
	boxChecked(e: any) {
		// Uncheck all_tags checkbox
		const all_check: HTMLInputElement | null = document.querySelector('#all_tags');
		if (all_check != null) {
			all_check.checked = false;
		}

		// Reload filters and courses
		this.loadFilters();
		this.filterCourses();
	}

	// Called on all_tags change
	allChecked(e: any) {
		// If checked, uncheck all checkboxes
		if (e.originalTarget.checked) {
			this.filters = this.display_tags;
			const checkbox_selector = 'input[type="checkbox"]:checked:not(#all_tags)';
			const checked: NodeListOf<HTMLInputElement> =
				document.querySelectorAll(checkbox_selector);
			for (const checkbox of checked) {
				checkbox.checked = false;
			}
			// If unchecked, empty filters
		} else {
			this.filters = [];
		}

		this.filterCourses();
	}

	// Populate checkboxes based on course tags
	loadTags() {
		const tags: { [tag: string]: number } = {};

		for (const course of this.course_list) {
			for (const tag of course['tags']) {
				if (tags[tag] == undefined) {
					tags[tag] = 1;
				} else {
					tags[tag] += 1;
				}
			}
		}

		this.sortTags = Object.fromEntries(Object.entries(tags).sort(([, a], [, b]) => b - a));
		this.display_tags = Object.keys(this.sortTags);
		this.filters = this.display_tags;
	}

	// Populate filters based on checked checkboxes
	loadFilters() {
		const checkbox_selector = 'input[type="checkbox"]:checked';
		const checked: NodeListOf<HTMLInputElement> = document.querySelectorAll(checkbox_selector);
		this.filters = [];
		for (const checkbox of checked) {
			this.filters.push(checkbox['name']);
		}
	}

	openDialog(course: CourseInfo) {
		this.dialog_handler.openDialog(course);
		//this.dialog_handler.openDialog({ hint: 'Test hint' });
	}
}
