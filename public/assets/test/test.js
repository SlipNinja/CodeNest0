import { exec } from 'node:child_process';
import fs from 'node:fs';

window.addEventListener('message', (e) => {
	const data = e.data;
	const code = data['code'];
	const tests = data['tests'];
	const f_name = data['f_name'];

	const results = [];

	for (const test of tests) {
		// Result of the current test
		const r = { output: undefined, passed: false, result: '' };

		// Fonction call
		const f_return = `return ${f_name}(${test['f_params'].join(',')});`;
		const f_call = `${code}${f_return}`;

		fs.writeFileSync('./execute.js', f_call);
		const child = exec('node ./execute.js');

        // STDOUT
		child.stdout.setEncoding('utf8');
		child.stdout.on('data', (data) => {
			console.log('stdout: ' + data);
		});

        // STDERR
		child.stderr.setEncoding('utf8');
		child.stderr.on('data', (data) => {
			console.log('stderr: ' + data);
		});

		// try {
		// 	r['output'] = new Function(f_call)();
		// } catch (e) {
		// 	r['result'] = `Error : ${e.message}`;
		// 	continue;
		// }

		// if (r['output'] == test['f_result']) {
		// 	r['result'] = `${f_name}(${test['f_params'].join(',')}) = ${r['output']}`;
		// 	r['passed'] = true;
		// } else {
		// 	r['result'] = `${f_name}(${test['f_params'].join(',')}) != ${r['output']}`;
		// 	r['passed'] = false;
		// }

		results.push(r);
	}

	const results_str = JSON.stringify(results);
	document.body.textContent = results_str;

	const parent_origin = globalThis.location.origin; // Change when deployed
	window.parent.postMessage(results, parent_origin);
});
