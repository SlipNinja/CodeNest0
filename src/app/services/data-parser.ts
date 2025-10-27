import { Injectable } from '@angular/core';
import { CourseInfo } from '../interfaces/course-info';

type QuestionsInfos = { [key: string]: string | number };

@Injectable({
	providedIn: 'root',
})
export class DataParser {
	base_url: string = 'https://jsonplaceholder.typicode.com';
	users_url: string = this.base_url + '/users';
	questions_url: string = this.base_url + '/posts';
	database_url = './assets/database.json';
	courses: CourseInfo[] = [];

	async getQuestions(): Promise<Map<string, string>> {
		const questions: Map<string, string> = new Map();
		const data = await fetch(this.questions_url);
		const json: QuestionsInfos[] = (await data.json()).slice(0, 5);

		for (const question of json) {
			const user_question: string = question['title'] as string;
			const user_response: string = question['body'] as string;
			questions.set(user_question, user_response);
		}

		return questions;
	}

	async fetchCourse(id: number): Promise<CourseInfo> {
		const data = await fetch(this.database_url);
		const data_json = await data.json();
		this.courses = data_json['courses'];

		return this.courses.find((course) => course['id'] == id) as CourseInfo;
	}

	async fetchCourses(n?: number): Promise<CourseInfo[]> {
		const data = await fetch(this.database_url);
		const data_json = await data.json();
		this.courses = data_json['courses'];

		return n === undefined ? data_json['courses'] : data_json['courses'].slice(0, n);
	}
}
