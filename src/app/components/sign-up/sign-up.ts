import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'app-sign-up',
	imports: [ReactiveFormsModule],
	templateUrl: './sign-up.html',
	styleUrl: './sign-up.scss',
})
export class SignUp {
	sign_up_form = new FormGroup({
		username: new FormControl(''),
		email: new FormControl(''),
		password: new FormControl(''),
		confirm_password: new FormControl(''),
	});

	// Handles sign up
	submitSignUp(): void {
		console.log(this.sign_up_form.value.username);
		console.log(this.sign_up_form.value.password);
	}

	// Handles toggle password visibility on icon click
	togglePassword(e: Event) {
		const button = e.target as HTMLInputElement;
		const password = button.previousElementSibling as HTMLInputElement;

		if (password.type == 'text') {
			button.classList = 'bi bi-eye';
			password.type = 'password';
		} else {
			button.classList = 'bi bi-eye-slash';
			password.type = 'text';
		}
	}
}
