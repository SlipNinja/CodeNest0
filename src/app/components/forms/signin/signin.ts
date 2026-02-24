import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule, Eye, EyeOff } from 'lucide-angular';
import { UserHandler } from '@services/user-handler';
import { RouterLink } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { User } from '@interfaces/user';

@Component({
	selector: 'app-signin',
	imports: [ReactiveFormsModule, LucideAngularModule, RouterLink],
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

	// Handles sign in
	submitSignIn(): void {
		const { email, password } = this.sign_in_form.value;
		const error_zone = (
			document.getElementsByClassName('error_zone') as HTMLCollectionOf<HTMLElement>
		)[0];
		const errors: string[] = [];

		if (!email) {
			errors.push('• Email required.');
		}

		if (!password) {
			errors.push('• Password required.');
		}

		if (errors.length > 0) {
			const error_log = errors.join('\n');
			error_zone.innerText = error_log;
			error_zone.style.display = 'block';
		}

		if (email && password) {
			this.user_service.login(email, password).subscribe(
				(response) => {
					if (response.status == 200) {
						const body: any = response.body;
						const token: string = body['message'];

						this.user_service.authenticate_user(token);
					}
				},
				(error) => {
					if (error.status == 404) errors.push('• User not found.');
					if (error.status == 401) errors.push('• Wrong credentials.');

					if (![401, 404].includes(error.status))
						errors.push(`• Unknown error : ${error.error}`);

					if (errors.length > 0) {
						const error_log = errors.join('\n');
						error_zone.innerText = error_log;
						error_zone.style.display = 'block';
					}
				},
			);
		}
	}

	// Handles toggle password visibility on icon click
	togglePassword(e: Event) {
		this.eye_open = !this.eye_open;
	}
}
