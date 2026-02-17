import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Step } from '@interfaces/step';
import { TestResponse } from '@interfaces/test-response';

@Injectable({
	providedIn: 'root',
})
export class CodeHandler {
	private readonly request_url = 'http://localhost:3000';

	constructor(private readonly http: HttpClient) {}

	test_user_code(step: Step, language: string, code: string) {
		const execute_request = `${this.request_url}/execute`;
		const execute_body = {
			step: step,
			lang: language,
			code: code,
		};

		return this.http.post<TestResponse[]>(execute_request, execute_body, {
			observe: 'response',
			withCredentials: true,
		});
	}
}
