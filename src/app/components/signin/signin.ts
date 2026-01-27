import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule, Eye, EyeOff } from 'lucide-angular';
import { UserHandler } from '@services/user-handler';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
	selector: 'app-signin',
	imports: [ReactiveFormsModule, LucideAngularModule],
	templateUrl: './signin.html',
	styleUrl: './signin.scss',
	providers: [CookieService],
})
export class SignIn {
	readonly Eye_open = Eye;
	readonly Eye_closed = EyeOff;
	eye_open: boolean = true;
	private readonly router = inject(Router);

	sign_in_form = new FormGroup({
		email: new FormControl(''),
		password: new FormControl(''),
	});

	constructor(
		private readonly user_service: UserHandler,
		private readonly cookie_service: CookieService,
	) {}

	login_user(email: string, password: string) {
		this.user_service.login(email, password).subscribe((data) => {
			if (data.status != 200) throw new Error('Cant login');
			else {
				const body: any = data.body;
				if (!body) throw new Error('No body found in response');

				this.cookie_service.set('jwt_token', body['message']);

				console.log(body['message']);
				const token_parts: string[] = body['message'].split('.');
				const encoded_payload: string = token_parts[1];
				console.log(encoded_payload);
				const raw_payload: string = atob(encoded_payload);
				console.log(raw_payload);
				const user_data = JSON.parse(raw_payload)['user'];
				console.log(user_data);

				// Navigate to profile ( TODO : handle user session )
				this.router.navigate(['/profile']);
			}
		});
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
