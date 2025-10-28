export interface User {
	id: number;
	firstname: string;
	lastname: string;
	username: string;
	email: string;
	password: string;
	courses_completed: number[];
	xp: number;
	last_course: number;
	profile_photo: string;
	badges: number[];
}
