import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { SignIn } from './components/signin/signin';
import { SignUp } from './components/sign-up/sign-up';
import { CourseList } from './components/course-list/course-list';
import { Profile } from './components/profile/profile';
import { CoursePage } from './components/course-page/course-page';

export const routes: Routes = [
	{
		path: '',
		component: Home,
		title: 'Home page',
	},
	{
		path: 'course-list',
		component: CourseList,
		title: 'Course list',
	},
	{
		path: 'sign-in',
		component: SignIn,
		title: 'Sign-in page',
	},
	{
		path: 'sign-up',
		component: SignUp,
		title: 'Sign-up page',
	},
	{
		path: 'profile',
		component: Profile,
		title: 'Profile page',
	},
	{
		path: 'course/:id',
		component: CoursePage,
		title: 'Course',
	},
];
