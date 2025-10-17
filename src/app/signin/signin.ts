import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'app-signin',
	imports: [ReactiveFormsModule],
	templateUrl: './signin.html',
	styleUrl: './signin.scss',
})
export class SignIn {
	signInForm = new FormGroup({
		username: new FormControl(''),
		password: new FormControl(''),
	});

	submitSignIn(): void {
		console.log(this.signInForm.value.username);
		console.log(this.signInForm.value.password);
	}

	togglePassword(e: any) {
		console.log(e.originalTarget.previousElementSibling);
		const button = e.originalTarget;
		const password = button.previousElementSibling;

		if (password.type == 'text') {
			button.classList = 'bi bi-eye';
			password.type = 'password';
		} else {
			button.classList = 'bi bi-eye-slash';
			password.type = 'text';
		}
	}
}
