import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Menu } from './menu/menu';
import { Footer } from './footer/footer';

@Component({
	selector: 'app-root',
	imports: [RouterModule, Menu, Footer],
	templateUrl: './app.html',
	styleUrl: './app.scss',
})
export class App {
	protected readonly title = signal('CodeNest0');
}
