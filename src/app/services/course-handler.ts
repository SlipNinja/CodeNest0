import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { CourseInfo } from '@interfaces/course-info';
import { Tag } from '@interfaces/tag';
import { Step } from '@interfaces/step';

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
		return this.http.get<Tag[]>(`${this.request_url}/tags/course/${id_course}`, {
			observe: 'response',
			withCredentials: true,
		});
	}

	request_course_taken(id_user: number, id_course: number) {
		const get_request = `${this.request_url}/courses/taken?id_user=${id_user}&id_course=${id_course}`;

		return this.http.get<Step[]>(get_request, {
			observe: 'response',
			withCredentials: true,
		});
	}

	request_course_step(id_course: number) {
		const get_request = `${this.request_url}/courses/${id_course}/steps`;

		return this.http.get(get_request, {
			observe: 'response',
			withCredentials: true,
		});
	}

	get_dependencies(id_course: number) {
		return this.http.get<CourseInfo[]>(
			`${this.request_url}/courses/${id_course}/dependencies`,
			{
				observe: 'response',
				withCredentials: true,
			},
		);
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
