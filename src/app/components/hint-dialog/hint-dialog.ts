import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'app-hint-dialog',
	imports: [MatDialogClose, RouterModule],
	templateUrl: './hint-dialog.html',
	styleUrl: './hint-dialog.scss',
})
export class HintDialog {
	data: any = inject(MAT_DIALOG_DATA);
}
