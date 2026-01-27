import { Injectable, inject } from '@angular/core';
import { CourseInfo } from '@interfaces/course-info';
import { DataParser } from '@services/data-parser';
import { CourseDialog } from '@components/dialogs/course-dialog/course-dialog';
import { MatDialog } from '@angular/material/dialog';
import { HintDialog } from '@components/dialogs/hint-dialog/hint-dialog';

type Hint = {
	hint: string;
};

@Injectable({
	providedIn: 'root',
})
export class DialogHandler {
	parser: DataParser = inject(DataParser);
	dialog = inject(MatDialog);
	dialogRef: any;

	// Generate data for the dialog replacing CourseInfo ids by CourseInfo data
	generateData(course: CourseInfo) {
		const dependencies: CourseInfo[] = [];
		const data = {
			id_course: course.id_course,
			name: course.name,
			logo: course.logo,
			level: course.level,
			description: course.description,
			dependencies: dependencies,
		};

		if (!course['dependencies']) return;

		// Display course dependencies
		for (const dep of course['dependencies']) {
			let course_dep: CourseInfo;
			this.parser.fetchCourse(dep).then((result) => {
				course_dep = result;
				data.dependencies.push(course_dep);
			});
		}

		return data;
	}

	// Handles dialog
	openDialog(dialog_type: string, data: object) {
		if (dialog_type == 'course') {
			this.openCourseDialog(data as CourseInfo);
		} else if (dialog_type == 'hint') {
			this.openHintDialog(data as Hint);
		}
	}

	// Open course dialog
	openCourseDialog(course: CourseInfo) {
		// Opens dialog
		this.dialogRef = this.dialog.open(CourseDialog, {
			data: this.generateData(course),
			backdropClass: 'backdrop',
			hasBackdrop: true,
		});
	}

	// Update dialog data with a new course
	openNewCourseDialog(id: number) {
		this.parser.fetchCourse(id).then((result) => {
			this.dialogRef.componentInstance.data = this.generateData(result);
		});
	}

	openHintDialog(hint: Hint) {
		// Opens dialog
		const dialogRef = this.dialog.open(HintDialog, {
			data: hint['hint'],
			backdropClass: 'backdrop',
			hasBackdrop: true,
		});

		// After dialog closed
		dialogRef.afterClosed().subscribe((result) => {
			console.log('Closed');
		});
	}
}
