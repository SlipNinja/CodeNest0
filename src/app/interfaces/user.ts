export interface User {
	id: number;
	firstname: string;
	lastname: string;
	username: string;
	email: string;
	password: string;
	courses_complete: number[];
	xp: number;
	last_course: number;
}
