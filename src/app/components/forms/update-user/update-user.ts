import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DataValidator } from '@services/data-validator';
import { UserHandler } from '@services/user-handler';

@Component({
	selector: 'app-update-user',
	imports: [ReactiveFormsModule, RouterModule],
	templateUrl: './update-user.html',
	styleUrl: './update-user.scss',
})
export class UpdateUser {
	update_form = new FormGroup({
		username: new FormControl(''),
		email: new FormControl(''),
	});

	constructor(
		private readonly user_service: UserHandler,
		private readonly data_validator: DataValidator,
	) {}

	submit_update(): void {
		let { username, email } = this.update_form.value;
		const error_zone = document.getElementsByClassName(
			'error_zone',
		) as HTMLCollectionOf<HTMLElement>;
		const errors: string[] = [];

		// username given but wrong size
		if (username && !this.data_validator.valid_size_username(username)) {
			errors.push('• Username must be between 8 and 20 characters.');
		}

		// email given but wrong size/invalid
		if (email && !this.data_validator.valid_size_email(email)) {
			errors.push("• Email can't be longer than 50 characters.");
		} else if (email && !this.data_validator.valid_email(email)) {
			errors.push('• Invalid email.');
		}

		// Nothing given
		if (!username && !email) {
			errors.push('• Nothing to update.');
		}

		// If there's errors
		if (errors.length > 0) {
			const error_log = errors.join('\n');
			error_zone[0].innerText = error_log;
			error_zone[0].style.display = 'block';
		} else {
			error_zone[0].innerText = '';
			error_zone[0].style.display = 'none';

			if (!email) email = '';
			if (!username) username = '';

			this.user_service.update_user(username, email);
		}
	}
}
