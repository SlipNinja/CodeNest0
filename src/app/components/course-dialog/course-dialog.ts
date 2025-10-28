import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { DialogHandler } from '@services/dialog-handler';

@Component({
	selector: 'app-course-dialog',
	templateUrl: './course-dialog.html',
	imports: [MatDialogClose, RouterModule],
	styleUrl: './course-dialog.scss',
})
export class CourseDialog {
	dialog_handler: DialogHandler = inject(DialogHandler);
	data: any = inject(MAT_DIALOG_DATA);

	openNew(id: number) {
		this.dialog_handler.openNewCourseDialog(id);
	}
}
