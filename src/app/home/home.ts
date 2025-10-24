import { Component, inject } from '@angular/core';
import { DataParser } from '../services/data-parser';
import { RouterModule } from '@angular/router';
import { CourseDialog } from '../course-dialog/course-dialog';
import { CourseInfo } from '../interfaces/course-info';
import { MatDialog } from '@angular/material/dialog';

@Component({
	selector: 'app-home',
	imports: [RouterModule],
	templateUrl: './home.html',
	styleUrl: './home.scss',
})
export class Home {
	parser: DataParser = inject(DataParser);
	dialog = inject(MatDialog);
	course_list: CourseInfo[] = [];
	questions: Map<string, string> = new Map();

	constructor() {
		this.loadQuestions();
		this.loadCourses();
	}

	async loadQuestions() {
		this.questions = await this.parser.getQuestions();
	}

	loadCourses() {
		this.course_list = this.parser.getCourses(3);
	}

	generateData(course: CourseInfo) {
		const dependencies: CourseInfo[] = [];
		const data = {
			id: course.id,
			name: course.name,
			logo: course.logo,
			level: course.level,
			description: course.description,
			dependencies: dependencies,
		};

		for (const dep of course['dependencies']) {
			const course_dep: CourseInfo = this.parser.getCourse(dep) as CourseInfo;
			data.dependencies.push(course_dep);
		}

		return data;
	}

	openDialog(course: CourseInfo) {
		const dialogRef = this.dialog.open(CourseDialog, {
			data: this.generateData(course),
			backdropClass: 'backdrop',
			hasBackdrop: true,
		});

		dialogRef.afterClosed().subscribe((result) => {
			// Click outside the dialog
			if (result == undefined) {
				return;
			}

			const parsed_result = JSON.parse(result);
			if (parsed_result['start'] != undefined) {
				//Go to course
			} else if (parsed_result['preview'] != undefined) {
				// Display another dialog
				this.openDialog(this.parser.getCourse(parsed_result['preview']) as CourseInfo);
			}
		});
	}
}
