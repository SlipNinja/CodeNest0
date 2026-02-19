import { Component, inject } from '@angular/core';
import { CourseInfo } from '@interfaces/course-info';
import { DataParser } from '@services/data-parser';
import { RouterModule } from '@angular/router';
import { DialogHandler } from '@services/dialog-handler';
import { CourseHandler } from '@services/course-handler';
import { UserHandler } from '@services/user-handler';
import { firstValueFrom } from 'rxjs';
import { Tag } from '@interfaces/tag';

@Component({
	selector: 'app-course-list',
	imports: [RouterModule],
	templateUrl: './course-list.html',
	styleUrl: './course-list.scss',
})
export class CourseList {
	dialog_handler = inject(DialogHandler);
	course_handler = inject(CourseHandler);
	user_handler = inject(UserHandler);
	parser: DataParser = inject(DataParser);

	course_list: CourseInfo[] = [];
	filtered_list: CourseInfo[] = [];
	sortTags: { [key: string]: number } = {};
	display_tags: Tag[] = [];
	filters: Tag[] = [];

	constructor() {
		const user = this.user_handler.current_user();
		if (user) {
			this.getCoursesForUser(user['id_user']);
		} else {
			this.getCourses();
		}
	}

	// Get all courses and tags and display them
	getCourses() {
		this.course_handler.get_courses().subscribe(async (result) => {
			this.course_list = this.course_handler.check_response(result);
			await this.loadTags();
			this.filtered_list = this.course_list;
		});
	}

	getCoursesForUser(id_user: number) {
		this.course_handler.get_courses_for_user(id_user).subscribe(async (result) => {
			this.course_list = this.course_handler.check_response(result);
			await this.loadTags();
			this.filtered_list = this.course_list;
		});
	}

	// Populate filtered courses based on filters
	filterCourses() {
		this.filtered_list = this.course_list.filter((course) => {
			if (!course['tags']) return;
			const tag_names = course['tags'].map((t) => t['name']);
			return this.filters.find((filter) => tag_names.includes(filter['name']));
		});
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
			this.filtered_list = this.course_list;
			// If unchecked, empty filters
		} else {
			this.filters = [];
			this.filterCourses();
		}
	}

	// Populate checkboxes based on course tags
	async loadTags() {
		const tags: { [tag: string]: number } = {};
		for (const course of this.course_list) {
			// Get tags by course
			const result = await firstValueFrom(this.course_handler.get_tags(course['id_course']));
			course['tags'] = this.course_handler.check_response(result);

			// Count tags
			if (course['tags']) {
				for (const tag of course['tags']) {
					const tag_name = tag['name'];
					if (tags[tag_name] == undefined) {
						tags[tag_name] = 1;
					} else {
						tags[tag_name] += 1;
					}
				}
			}
		}

		this.sortTags = Object.fromEntries(Object.entries(tags).sort(([, a], [, b]) => b - a));
		this.display_tags = Object.keys(this.sortTags).map((s) => {
			return { name: s };
		});
		this.filters = this.display_tags;
	}

	// Populate filters based on checked checkboxes
	loadFilters() {
		const checkbox_selector = 'input[type="checkbox"]:checked';
		const checked: NodeListOf<HTMLInputElement> = document.querySelectorAll(checkbox_selector);
		this.filters = [];
		for (const checkbox of checked) {
			this.filters.push({ name: checkbox['name'] });
		}
	}

	// Open course dialog on click
	openDialog(course: CourseInfo) {
		this.dialog_handler.openDialog('course', course);
	}
}
