import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserHandler } from '@services/user-handler';
import { LucideAngularModule, Eye, EyeOff } from 'lucide-angular';
import { RouterModule } from '@angular/router';
import { DataValidator } from '@services/data-validator';

@Component({
	selector: 'app-sign-up',
	imports: [ReactiveFormsModule, LucideAngularModule, RouterModule],
	templateUrl: './sign-up.html',
	styleUrl: './sign-up.scss',
})
export class SignUp {
	readonly Eye_open = Eye;
	readonly Eye_closed = EyeOff;
	eye_open: boolean = true;
	eye_open_confirm: boolean = true;

	sign_up_form = new FormGroup({
		username: new FormControl(''),
		email: new FormControl(''),
		password: new FormControl(''),
		confirm_password: new FormControl(''),
	});

	constructor(
		private readonly user_service: UserHandler,
		private readonly data_validator: DataValidator,
	) {}

	// Handles sign up
	submitSignUp(): void {
		const { username, email, password, confirm_password } = this.sign_up_form.value;
		const error_zone = document.getElementsByClassName(
			'error_zone',
		) as HTMLCollectionOf<HTMLElement>;
		const errors: string[] = [];

		if (username && !this.data_validator.valid_username(username)) {
			errors.push('• Username must only contain alphanumerical characters.');
		}
		if (!username || !this.data_validator.valid_size_username(username)) {
			errors.push('• Username must be between 5 and 20 characters.');
		}

		if (!email) {
			errors.push('• Email is required.');
		} else if (!this.data_validator.valid_size_email(email)) {
			errors.push("• Email can't be longer than 50 characters.");
		} else if (!this.data_validator.valid_email(email)) {
			errors.push('• Invalid email.');
		}

		if (!password || !this.data_validator.valid_size_password(password)) {
			errors.push('• Password must be between 8 and 20 characters.');
		}

		if (password && !this.data_validator.has_special_char(password)) {
			errors.push(
				'• Password must contain at least one special character (!, @, #, $, %, *, &).',
			);
		}

		if (password != confirm_password) {
			errors.push('• Password must match confirmation.');
		}

		if (errors.length > 0) {
			const error_log = errors.join('\n');
			error_zone[0].innerText = error_log;
			error_zone[0].style.display = 'block';
		} else {
			error_zone[0].innerText = '';
			error_zone[0].style.display = 'none';
			if (!email || !password || !username) return;
			this.user_service.add_user(email, password, username);
		}
	}

	// Handles toggle password visibility on icon click
	togglePassword(e: Event) {
		this.eye_open = !this.eye_open;
	}

	// Handles toggle password visibility on icon click
	togglePasswordConfirm(e: Event) {
		this.eye_open_confirm = !this.eye_open_confirm;
	}
}
