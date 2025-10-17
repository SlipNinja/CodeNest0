import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class DataParser {
	public questions: Map<string, string> = new Map();
	users: { [key: string]: string | number }[] = [];

	base_url: string = 'https://jsonplaceholder.typicode.com';
	users_url: string = this.base_url + '/users';
	questions_url: string = this.base_url + '/posts';

	async getUsers(): Promise<void> {
		const data = await fetch(this.users_url);
		this.users = await data.json();
	}

	async getQuestions(): Promise<void> {
		const data = await fetch(this.questions_url);
		const json: { [key: string]: string | number }[] = (await data.json()).slice(0, 5);

		for (const question of json) {
			const user_question: string = question['title'] as string;
			const user_response: string = question['body'] as string;
			this.questions.set(user_question, user_response);
		}
	}
}
