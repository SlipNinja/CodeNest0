import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { CourseInfo } from '@interfaces/course-info';
import { DialogHandler } from '@services/dialog-handler';

interface CourseDialogDisplay {
	id: number;
	name: string;
	logo: string;
	level: string;
	description: string;
	dependencies: CourseInfo[];
}

@Component({
	selector: 'app-course-dialog',
	templateUrl: './course-dialog.html',
	imports: [MatDialogClose, RouterModule],
	styleUrl: './course-dialog.scss',
})
export class CourseDialog {
	dialog_handler: DialogHandler = inject(DialogHandler);
	data: CourseDialogDisplay = inject(MAT_DIALOG_DATA);

	// On click on dependency course
	openNew(id: number) {
		this.dialog_handler.openNewCourseDialog(id);
	}
}
