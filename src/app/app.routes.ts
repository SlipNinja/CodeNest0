import { Routes } from '@angular/router';
import { Home } from './home/home';
import { SignIn } from './signin/signin';

export const routes: Routes = [
	{
		path: 'sign-in',
		component: SignIn,
		title: 'Sign-in page',
	},
	{
		path: '',
		component: Home,
		title: 'Home page',
	},
];
