import { Injectable, inject } from '@angular/core';
import { CourseInfo } from '../interfaces/course-info';
import { DataParser } from './data-parser';
import { CourseDialog } from '../course-dialog/course-dialog';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
	providedIn: 'root',
})
export class DialogHandler {
	parser: DataParser = inject(DataParser);
	dialog = inject(MatDialog);

	// Generate data for the dialog replacing CourseInfo ids by CourseInfo data
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

	// Handles dialog
	openDialog(course: CourseInfo) {
		// Opens dialog
		const dialogRef = this.dialog.open(CourseDialog, {
			data: this.generateData(course),
			backdropClass: 'backdrop',
			hasBackdrop: true,
		});

		// After dialog closed
		dialogRef.afterClosed().subscribe((result) => {
			// Click outside the dialog
			if (result == undefined) {
				return;
			}

			const parsed_result = JSON.parse(result);
			// CLicked on start course
			if (parsed_result['start'] != undefined) {
				//Go to course
			}
			// Clicked on a recommended course
			else if (parsed_result['preview'] != undefined) {
				// Open the course
				this.openDialog(this.parser.getCourse(parsed_result['preview']) as CourseInfo);
			}
		});
	}
}
