import { Component } from '@angular/core';
import { CourseInfo } from '../interfaces/course-info';

@Component({
	selector: 'app-course-dialog',
	imports: [],
	templateUrl: './course-dialog.html',
	styleUrl: './course-dialog.scss',
})
export class CourseDialog {
	display(course: CourseInfo) {
		const dialog: HTMLDialogElement = document.getElementsByTagName('dialog')[0];

		dialog.getElementsByTagName('img')[0].src = course.logo;
		dialog.getElementsByTagName('img')[1].src = course.level;
		dialog.getElementsByTagName('h3')[0].textContent = course.name;
		dialog.getElementsByTagName('p')[0].textContent = course.description;
		dialog.showModal();

		dialog.querySelector('button.close')?.addEventListener('click', () => {
			dialog.close();
		});
	}
}
