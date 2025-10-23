import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'app-course-dialog',
	templateUrl: './course-dialog.html',
	imports: [MatDialogClose, RouterModule],
	styleUrl: './course-dialog.scss',
})
export class CourseDialog {
	data: any = inject(MAT_DIALOG_DATA);
}
