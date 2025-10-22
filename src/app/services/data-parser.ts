import { Injectable } from '@angular/core';
import { CourseInfo } from '../interfaces/course-info';

type QuestionsInfos = { [key: string]: string | number };

@Injectable({
	providedIn: 'root',
})
export class DataParser {
	public questions: Map<string, string> = new Map();
	users: { [key: string]: string | number }[] = [];
	homepage_courses: CourseInfo[] = [];

	base_url: string = 'https://jsonplaceholder.typicode.com';
	users_url: string = this.base_url + '/users';
	questions_url: string = this.base_url + '/posts';

	async getUsers(): Promise<void> {
		const data = await fetch(this.users_url);
		this.users = await data.json();
	}

	async getQuestions(): Promise<void> {
		const data = await fetch(this.questions_url);
		const json: QuestionsInfos[] = (await data.json()).slice(0, 5);

		for (const question of json) {
			const user_question: string = question['title'] as string;
			const user_response: string = question['body'] as string;
			this.questions.set(user_question, user_response);
		}
	}

	getCourses(n: number | undefined = undefined) {
		if (n == undefined) {
			this.homepage_courses = this.tmp_courses;
		} else {
			this.homepage_courses = this.tmp_courses.slice(0, n);
		}
	}

	tmp_courses: CourseInfo[] = [
		{
			id: 1,
			name: 'First steps',
			logo: './assets/imgs/js.png',
			level: './assets/imgs/beginner.png',
			description:
				'Tired of the lack of interactions in your web pages ? This Javascript beginner course may be just what you need !',
		},
		{
			id: 2,
			name: 'First steps',
			logo: './assets/imgs/css.png',
			level: './assets/imgs/beginner.png',
			description: 'Start stylizing your web pages now with this CSS beginner course !',
		},
		{
			id: 3,
			name: 'First steps',
			logo: './assets/imgs/html.png',
			level: './assets/imgs/beginner.png',
			description:
				'Take your first steps in the creation of websites with this beginner HTML course !',
		},
		{
			id: 4,
			name: 'First steps',
			logo: './assets/imgs/python.png',
			level: './assets/imgs/beginner.png',
			description:
				'Start learning one of the powerful multi usage language now with this Python beginner course !',
		},
		{
			id: 5,
			name: 'Functions',
			logo: './assets/imgs/js.png',
			level: './assets/imgs/easy.png',
			description:
				'Now that you have the very basics, we can go a bit further inside of the world of Javascript',
		},
		{
			id: 6,
			name: 'Selectors',
			logo: './assets/imgs/css.png',
			level: './assets/imgs/easy.png',
			description:
				"It's time to continue our journey on the CSS road, this is a big one ( but you'll be fine I swear )",
		},
		{
			id: 7,
			name: 'Conditions',
			logo: './assets/imgs/js.png',
			level: './assets/imgs/easy.png',
			description: "After getting the basics, let's add another bloc to our foundations",
		},
		{
			id: 8,
			name: 'Classes and objects',
			logo: './assets/imgs/js.png',
			level: './assets/imgs/medium.png',
			description:
				"Things start to get serious now, let's talk about Object Oriented Programming !",
		},
	];
}
