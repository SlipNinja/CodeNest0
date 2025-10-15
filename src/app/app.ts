import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Home } from './home/home';
import { Menu } from './menu/menu';
import { Footer } from './footer/footer';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet, Home, Menu, Footer],
	templateUrl: './app.html',
	styleUrl: './app.scss',
})
export class App {
	protected readonly title = signal('CodeNest0');
}
