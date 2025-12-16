import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule, Eye, EyeOff } from 'lucide-angular';

@Component({
	selector: 'app-sign-up',
	imports: [ReactiveFormsModule, LucideAngularModule],
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

	// Handles sign up
	submitSignUp(): void {
		console.log(this.sign_up_form.value.username);
		console.log(this.sign_up_form.value.password);
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
