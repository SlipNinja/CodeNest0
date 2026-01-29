import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { CourseInfo } from '@interfaces/course-info';
import { DialogHandler } from '@services/dialog-handler';
import { CourseDialogData } from '@interfaces/course-dialog-data';

@Component({
	selector: 'app-course-dialog',
	templateUrl: './course-dialog.html',
	imports: [MatDialogClose, RouterModule],
	styleUrl: './course-dialog.scss',
})
export class CourseDialog {
	dialog_handler: DialogHandler = inject(DialogHandler);
	data: CourseDialogData = inject(MAT_DIALOG_DATA);

	// On click on dependency course
	openNew(id: number) {
		this.dialog_handler.openNewCourseDialog(id);
	}
}
