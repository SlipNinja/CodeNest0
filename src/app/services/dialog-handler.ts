import { Injectable, inject } from '@angular/core';
import { CourseInfo } from '@interfaces/course-info';
import { DataParser } from '@services/data-parser';
import { CourseDialog } from '@components/dialogs/course-dialog/course-dialog';
import { MatDialog } from '@angular/material/dialog';
import { HintDialog } from '@components/dialogs/hint-dialog/hint-dialog';
import { CourseHandler } from './course-handler';
import { firstValueFrom } from 'rxjs';
import { CourseDialogData } from '@interfaces/course-dialog-data';
import { WarningDialog } from '@components/dialogs/warning-dialog/warning-dialog';

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

	constructor(private readonly course_handler: CourseHandler) {}

	// Generate data for the dialog replacing CourseInfo ids by CourseInfo data
	async generateData(course: CourseInfo) {
		const course_dependencies_ids = this.course_handler.check_response(
			await firstValueFrom(this.course_handler.get_dependencies(course['id_course'])),
		);
		const dependencies: CourseDialogData[] = [];
		const data = {
			id_course: course.id_course,
			name: course.name,
			logo: course.logo,
			level: course.level,
			description: course.description,
			dependencies: dependencies,
		};

		if (!course_dependencies_ids) return;

		// Display course dependencies
		for (const dep of course_dependencies_ids) {
			const course_dep: CourseDialogData[] = this.course_handler.check_response(
				await firstValueFrom(this.course_handler.get_course(dep['id_dependency_course'])),
			);
			data.dependencies.push(course_dep[0]);
		}

		return data;
	}

	// Handles dialog
	openDialog(dialog_type: string, data: any) {
		if (dialog_type == 'course') {
			this.openCourseDialog(data as CourseInfo);
		} else if (dialog_type == 'hint') {
			this.openHintDialog(data as Hint);
		} else if (dialog_type == 'warning') {
			this.openWarningDialog(data);
		}
	}

	// Open course dialog
	async openCourseDialog(course: CourseInfo) {
		// Opens dialog
		this.dialogRef = this.dialog.open(CourseDialog, {
			data: await this.generateData(course),
			backdropClass: 'backdrop',
			hasBackdrop: true,
		});
	}

	// Update dialog data with a new course
	async update_course_data(id: number) {
		const course_dep: CourseInfo[] = this.course_handler.check_response(
			await firstValueFrom(this.course_handler.get_course(id)),
		);

		this.dialogRef.componentInstance.data = await this.generateData(course_dep[0]);
	}

	openWarningDialog(text: string) {
		// Opens dialog
		const dialogRef = this.dialog.open(WarningDialog, {
			data: { text: text },
			backdropClass: 'backdrop',
			hasBackdrop: true,
		});

		// After dialog closed
		dialogRef.afterClosed().subscribe((result) => {
			console.log('Closed');
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
