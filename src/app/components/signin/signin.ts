import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule, Eye, EyeOff } from 'lucide-angular';
import { UserHandler } from '@services/user-handler';

@Component({
	selector: 'app-signin',
	imports: [ReactiveFormsModule, LucideAngularModule],
	templateUrl: './signin.html',
	styleUrl: './signin.scss',
})
export class SignIn {
	readonly Eye_open = Eye;
	readonly Eye_closed = EyeOff;
	eye_open: boolean = true;

	sign_in_form = new FormGroup({
		email: new FormControl(''),
		password: new FormControl(''),
	});

	constructor(private readonly user_service: UserHandler) {}

	login_user(email: string, password: string) {
		this.user_service.login(email, password);
	}

	// Handles sign in
	submitSignIn(): void {
		const { email, password } = this.sign_in_form.value;
		if (email && password) {
			this.login_user(email, password);
		}
	}

	// Handles toggle password visibility on icon click
	togglePassword(e: Event) {
		this.eye_open = !this.eye_open;
	}
}
