import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-course-page',
	imports: [],
	templateUrl: './course-page.html',
	styleUrl: './course-page.scss',
})
export class CoursePage implements OnInit, OnDestroy {
	private route_sub: Subscription;
	private readonly route = inject(ActivatedRoute);

	ngOnInit(): void {
		this.route_sub = this.route.params.subscribe((params) => {
			console.log('Loading course with id', params['id']);
		});
	}

	ngOnDestroy() {
		this.route_sub.unsubscribe();
	}
}
