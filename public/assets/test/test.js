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

		try {
			r['output'] = new Function(f_call)();
		} catch (e) {
			r['output'] = undefined;
			r['result'] = `Error : ${e.message}`;
			r['passed'] = false;
			continue;
		}

		if (r['output'] == test['f_result']) {
			r['result'] = `${f_name}(${test['f_params'].join(',')}) = ${r['output']}`;
			r['passed'] = true;
		} else {
			r['result'] = `${f_name}(${test['f_params'].join(',')}) != ${r['output']}`;
			r['passed'] = false;
		}

		results.push(r);
	}

	document.body.textContent = JSON.stringify(results);
	window.top.postMessage(result, '*');
});
