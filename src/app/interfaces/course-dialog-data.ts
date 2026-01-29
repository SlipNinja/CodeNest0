export interface CourseDialogData {
	id_course: number;
	name: string;
	logo: string;
	level: string;
	description: string;
	dependencies: CourseDialogData[];
}
