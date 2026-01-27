import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserHandler } from '@services/user-handler';
import { CookieService } from 'ngx-cookie-service';

@Component({
	selector: 'app-menu',
	imports: [RouterModule],
	templateUrl: './menu.html',
	styleUrl: './menu.scss',
})
export class Menu {
	connected: boolean = false;

	constructor(
		private readonly user_handler: UserHandler,
		private readonly cookie_service: CookieService,
	) {
		// If user is already connected
		const jwt_token = this.cookie_service.get('jwt_token');
		if (jwt_token) this.connected = true;

		// Listen to connexion state to update
		this.user_handler.connected.subscribe((state) => (this.connected = state));
	}
}
