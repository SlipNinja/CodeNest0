import { Component, inject } from '@angular/core';
import { CourseInfo } from '../interfaces/course-info';
import { DataParser } from '../services/data-parser';
import { MatDialog } from '@angular/material/dialog';
import { CourseDialog } from '../course-dialog/course-dialog';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'app-course-list',
	imports: [RouterModule],
	templateUrl: './course-list.html',
	styleUrl: './course-list.scss',
})
export class CourseList {
	parser: DataParser = inject(DataParser);
	dialog = inject(MatDialog);
	course_list: CourseInfo[] = [];
	filtered_list: CourseInfo[] = [];
	sortTags: { [key: string]: number } = {};
	display_tags: string[] = [];

	constructor() {
		this.loadCourses();
		this.loadTags();
	}

	loadCourses() {
		this.course_list = this.parser.getCourses();
		this.filtered_list = this.course_list;
	}

	filterCourses(e: any = undefined): CourseInfo[] {
		console.log(e.originalTarget);
		return this.course_list;
	}

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
	}

	generateData(course: CourseInfo) {
		const dependencies: CourseInfo[] = [];
		const data = {
			id: course.id,
			name: course.name,
			logo: course.logo,
			level: course.level,
			description: course.description,
			dependencies: dependencies,
		};

		for (const dep of course['dependencies']) {
			const course_dep: CourseInfo = this.parser.getCourse(dep) as CourseInfo;
			data.dependencies.push(course_dep);
		}

		return data;
	}

	openDialog(course: CourseInfo) {
		const dialogRef = this.dialog.open(CourseDialog, {
			data: this.generateData(course),
			backdropClass: 'backdrop',
			hasBackdrop: true,
		});

		dialogRef.afterClosed().subscribe((result) => {
			// Click outside the dialog
			if (result == undefined) {
				return;
			}

			const parsed_result = JSON.parse(result);
			if (parsed_result['start'] != undefined) {
				//Go to course
			} else if (parsed_result['preview'] != undefined) {
				// Display another dialog
				this.openDialog(this.parser.getCourse(parsed_result['preview']) as CourseInfo);
			}
		});
	}
}
