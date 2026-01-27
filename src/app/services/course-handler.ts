import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { CourseInfo } from '@interfaces/course-info';

@Injectable({
	providedIn: 'root',
})
export class CourseHandler {
	database_url = './assets/database.json';
	request_url = 'http://localhost:3000';
	router: Router = new Router();

	constructor(
		private readonly http: HttpClient,
		private readonly cookie_service: CookieService,
	) {}

	get_course(id_course: number) {
		return this.http.get<CourseInfo>(`${this.request_url}/courses/${id_course}`, {
			observe: 'response',
			withCredentials: true,
		});
	}
}
