import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class DataValidator {
	email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	special_chars = '!@#$%*&';
	special_char_regex = /[!@#$%*&]/;
	alphanumeric_regex = /^[\w]+$/;
	password_min = 8;
	password_max = 20;
	email_max = 50;
	username_min = 5;
	username_max = 20;

	valid_email(email: string) {
		return this.email_regex.test(email);
	}

	valid_username(username: string) {
		return this.alphanumeric_regex.test(username);
	}

	valid_size_email(email: string) {
		return email.length <= this.email_max;
	}

	valid_size_password(password: string) {
		return password.length >= this.password_min && password.length <= this.password_max;
	}

	valid_size_username(username: string) {
		return username.length >= this.username_min && username.length <= this.password_max;
	}

	has_special_char(password: string) {
		return this.special_char_regex.test(password);
	}

	// TESTS
	test_email(email: string) {
		const is_valid = this.valid_email(email) ? 'is valid' : 'is not valid';
		console.log(`${email} - ${is_valid}`);
	}

	test_password(pass: string) {
		const is_valid = this.valid_size_password(pass) ? 'is valid' : 'is not valid';
		const has_char = this.has_special_char(pass) ? 'has special char' : 'has not special char';
		console.log(`${pass} - ${is_valid} - ${has_char}`);
	}

	test_validators() {
		this.test_email('');
		this.test_email('azerty');
		this.test_email('@zerty.com');
		this.test_email('azerty@');
		this.test_email('azerty@@test');
		this.test_email('azerty@test.');
		this.test_email('az!rty@test.te@t');
		this.test_email('azerty@test.test');
		this.test_email('az!rty@test.test');

		this.test_password('');
		this.test_password('zaer');
		this.test_password('azert');
		this.test_password('azertyu');
		this.test_password('azertyuiopqsdfghjklm');
		this.test_password('azertyuiopqsdfghjklmw');
		this.test_password('azertyuiopqs@fghjklm');
		this.test_password('art!');
		this.test_password('azertyu*');
		this.test_password('aezr!*!!thgf@dv');
	}
}
