import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserHandler } from '@services/user-handler';

@Component({
	selector: 'app-menu',
	imports: [RouterModule],
	templateUrl: './menu.html',
	styleUrl: './menu.scss',
})
export class Menu {
	connected: boolean = false;

	constructor(private readonly user_handler: UserHandler) {
		user_handler.connected.subscribe((state) => (this.connected = state));
	}
}
