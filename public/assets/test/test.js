window.addEventListener('message', (e) => {
	console.log('DATA RECEIVED :');
	console.log(e.data);

	// https://stackoverflow.com/questions/42309058/using-javascripts-eval-with-multiple-dependent-functions

	window.top.postMessage('RESULTS', '*');
});
