import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'app-signin',
	imports: [ReactiveFormsModule],
	templateUrl: './signin.html',
	styleUrl: './signin.scss',
})
export class SignIn {
	sign_in_form = new FormGroup({
		username: new FormControl(''),
		password: new FormControl(''),
	});

	// Handles sign in
	submitSignIn(): void {
		console.log(this.sign_in_form.value.username);
		console.log(this.sign_in_form.value.password);
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
