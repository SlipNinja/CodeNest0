import { Routes } from '@angular/router';
import { Home } from './home/home';
import { SignIn } from './signin/signin';
import { SignUp } from './sign-up/sign-up';

export const routes: Routes = [
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
		path: '',
		component: Home,
		title: 'Home page',
	},
];
