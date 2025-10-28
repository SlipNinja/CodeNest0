import { TestBed } from '@angular/core/testing';
import { DataParser } from './data-parser';

describe('DataParser', () => {
	let service: DataParser;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(DataParser);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
