import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { DialogHandler } from '@services/dialog-handler';

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

	delete_user(e: any) {
		this.dialog_handler.delete_current_user();
	}
}
