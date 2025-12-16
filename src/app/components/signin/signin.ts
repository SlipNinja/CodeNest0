import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule, Eye, EyeOff } from 'lucide-angular';

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
		this.eye_open = !this.eye_open;
	}
}
