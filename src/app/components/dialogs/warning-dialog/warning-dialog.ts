import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { DialogHandler } from '@services/dialog-handler';
import { CourseDialogData } from '@interfaces/course-dialog-data';

interface WarningDialogData {
	text: string;
}

@Component({
	selector: 'app-course-dialog',
	templateUrl: './warning-dialog.html',
	imports: [MatDialogClose, RouterModule],
	styleUrl: './warning-dialog.scss',
})
export class WarningDialog {
	dialog_handler: DialogHandler = inject(DialogHandler);
	data: WarningDialogData = inject(MAT_DIALOG_DATA);

	coucou(e: any) {
		console.log('DELEEEEETE !');
	}
}
