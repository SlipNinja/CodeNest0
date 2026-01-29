import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { CourseInfo } from '@interfaces/course-info';
import { Tag } from '@interfaces/tag';

@Injectable({
	providedIn: 'root',
})
export class CourseHandler {
	private readonly request_url = 'http://localhost:3000';

	constructor(private readonly http: HttpClient) {}

	get_course(id_course: number) {
		return this.http.get<CourseInfo>(`${this.request_url}/courses/${id_course}`, {
			observe: 'response',
			withCredentials: true,
		});
	}

	get_courses() {
		return this.http.get<CourseInfo[]>(`${this.request_url}/courses`, {
			observe: 'response',
			withCredentials: true,
		});
	}

	get_tags(id_course: number) {
		return this.http.get<Tag[]>(`${this.request_url}/courses/${id_course}/tags`, {
			observe: 'response',
			withCredentials: true,
		});
	}

	check_response(response: HttpResponse<any>) {
		if (![200, 201].includes(response.status)) {
			throw new Error(`Request failed with status ${response.status}`);
		}

		const body: any = response.body;
		if (!body) {
			throw new Error(`No body found in request`);
		}

		return body;
	}
}
