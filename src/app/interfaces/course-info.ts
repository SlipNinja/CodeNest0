export interface CourseInfo {
	id_course: number;
	name: string;
	logo: string;
	level: string;
	description: string;
	programming_language: string;
	number_step: number;
	dependencies?: number[];
	tags?: string[];
}
