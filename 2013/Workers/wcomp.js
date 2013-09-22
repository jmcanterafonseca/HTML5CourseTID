var has_to_finish = false;

// Handler for the messages sent to the worker
self.postMessage({type:'alert',data:'Worker created'});

self.onmessage = function(m) {
	if(m.data.type == 'start')  {
		has_to_finish = false;
		compute();
	}
}

function compute() {
	var num_times = 0;
	do {
		for(var i = 0; i < 1000000; i++) {
			var a = 1234;
		}
		num_times++;
		if(num_times <= 100)  {
			postMessage({type:'progress',data:num_times});
		}

		if(num_times == 100) {
			has_to_finish = true;
		}
	} while(!has_to_finish)

	postMessage({type:'alert',data:'Computation finished'});
}
