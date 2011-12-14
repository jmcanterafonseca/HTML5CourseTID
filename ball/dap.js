/**
 *  
 *  This library is aimed at abstracting differences between different
 *  Device APIs implementations. Particularly Mozilla B2G, WAC 2.0 and PhoneGap
 *  
 *  Author: José M. Cantera (jmcf@tid.es)
 *  
 *  Copyright (c) 2011 Telefónica Digital. All rigths reserved
 *
 *  License to be defined
 * 
 * 
 */

// Generic DOM accessor by element id
function ele(id) {
	return document.getElementById(id);
}

// Global DAPJS object
if(!window.dapjs) {
	window.dapjs = (function() {
		var readCB = null;
		var watchCB = null;
		var oldOrientation = 0;
		
		var that = this;
		
		window.addEventListener("load",consoleHandler,false);
		
		function consoleHandler() {
			if(window.fakeConsole) {
				var objConsole = new DapConsole();
				window.console = objConsole;
				window.onerror = errorHandler;
			}
		}
		
		function errorHandler(msg,url,lineNumber) {
			var str = '';
			
			if(url) {
				str += url + " : ";
			}
			
			if(lineNumber) {
				str += lineNumber + " : "; 
			}
			
			if(msg) {
				str += msg;
			}
			
			window.console.log(str);
			
			return false;
		}
		
		function DapConsole() {
			paint();
			
			this.element = console();
			
			function paint() {			 							
				var ele = document.createElement("div");
				ele.id = "dapjs_console";
				ele.style.overflow = "auto";
				ele.className = "console";
				
				ele.innerHTML = '<p id="dapjs_theConsole"></p>';
				document.body.appendChild(ele);
			}
			
			function console () {
				return ele("dapjs_console");
			}
			
			this.log = function(msg) {
				var cons = console().firstChild;
				var prev = cons.innerHTML;
				if(prev) {
					prev += "<br>";
				}
				
				var date = new Date();
				var hours = date.getHours().toString();
				if(hours.length < 2) { hours = "0" + hours; }
				
				var mins = date.getMinutes().toString();
				if(mins.length < 2) { mins = "0" + mins; }
				
				var secs = date.getSeconds().toString();
				if(secs.length < 2) { secs = "0" + secs; }
				var milis = date.getMilliseconds().toString();
				if(milis.length == 1) { 
					milis = "00" + milis; 
				}
				else if(milis.length == 2) {
					milis = "0" + milis;
				}
				
				cons.innerHTML = prev + ("[" + hours + ":" + 
						mins + ":" + secs + ":" + 
						milis + "] " + msg);
			}
			
			this.toggleShow = function() {
				if(console().style.display != 'none') {
					console().style.display = 'none';
				}
				else {
					console().style.display = 'block';
				}
			}
			
			this.clear = function () {
				console().firstChild.innerHTML = '';
			}
		}
		
		function orientationRead(e) {
			window.console.log("Orientation read invoked");
			
			var normalized = getScreenOrientation(e);
			
			if(normalized != null) {
				window.console.log("normalized value: " + normalized);
				oldOrientation = normalized;
			}
			else normalized = oldOrientation;
			
			readCB(normalized);
		}
		
		function getScreenOrientation(e) {
			var beta = e.data.beta;
			var gamma = e.data.gamma;
			var value = null;
			
			window.console.log("Beta: " + beta);
			
			if(beta < -45) {
				if(beta > -135) {
					value = 180;
				}
			}
			else if(beta > 45) {
				if(beta < 135) {
					value = 0;
				}
			}
			else if(gamma > 45) {
				value = -90;
			}
			else if(gamma < -45) {
				value = 90;
			}
			
			return value;
		}
		
		function orientationWatch(e) {
			var normalized = getScreenOrientation(e);
			
			if(normalized == null) {
				normalized = oldOrientation;
			}
			
			if(normalized != oldOrientation) {
				oldOrientation = normalized;
				watchCB(normalized);
			}
		}
		
		return {
			// Returns screen orientation 
			orientation: function(cb) {
				var or = window.orientation;
				if(!or) {
					window.console.log("window.orientation property not available");
					
					readCB = cb;
					var orientation = navigator.sensors.orientation;
					orientation.onsensordata = orientationRead;
					orientation.onerror = this.onerror;
					orientation.read();
				}
				else {
					window.console.log("window.orientation property available");
					cb(or);
				}
			},
			// Watch for changes in orientation
			onorientationchange: function(handler) {
				if(window.orientation) {
					window.onorientationchange = handler;
				}
				else {
					watchCB = handler;
					oldOrientation = null;
					
					var orientation = navigator.sensors.orientation;
					
					if(handler) {
						orientation.onsensordata = orientationWatch;
						orientation.onerror = this.onerror;
						orientation.startWatch({interval:500});
					}
					else {
						orientation.onsensordata = null;
						orientation.endWatch();
					}
				}
			}
		};
	})();
}

/** Normalization to W3C DAP vibrator API */
if (!navigator.vibrate) {
	navigator.vibrate = function(time) {
		if (window.deviceapis) {
			deviceapis.deviceinteraction.startVibrate(function() {
			}, function() {
			}, time);
		} else if (navigator.mozVibrate) {
			navigator.mozVibrate(time);
		} else if (navigator.notification) {
			navigator.notification.vibrate(time);
		}
	}; // navigator.vibrate
} // if(navigator.vibrate)

/** Normalization to W3C Sensor API */
/* See http://dev.w3.org/2009/dap/system-info/Sensors.html */
if (!navigator.sensors) {
	navigator.sensors = {};
}

if (!navigator.sensors.accelerometer) {
	navigator.sensors.accelerometer = new function() {
		var watchId = null;
		var that = this;
		var accel = null;
		var gravity = 9.81;
		var interval = null;
		var oldTimestamp = null;
		var readRequested = false;

		function deviceMotionHandler(e) {
			// window.console.log("device motion invoked");
			// Here we normalize to the corresponding values
			var currentTimestamp = new Date().getTime();

			if (!oldTimestamp || !interval || currentTimestamp - oldTimestamp >= interval) {

				var obj = normalize(e);

				// window.console.log(that.onsensordata);
				oldTimestamp = currentTimestamp;
				
				window.setTimeout(
						function() { that.onsensordata({data : obj,
								timestamp:currentTimestamp,
								reason:"watch"}); },0);
			}
		}
		
		function normalize(e) {
			var values = e.accelerationIncludingGravity;
			var obj = values;

			if (/* window.OrientationEvent */true) {
				obj = {};
				// This is mozilla old staff
				window.console.log("Mozilla motion events");
				obj.x = values.x * gravity;
				obj.y = values.y * gravity;
				obj.z = values.z * gravity;
			}
			
			return obj;
		}
		
		function deviceMotionReader(e) {
			if(readRequested) {
				var currentTimestamp = new Date().getTime();
				readRequested = false;
				
				window.setTimeout(function() { removeEventListener("devicemotion",deviceMotionReader); },0);
				
				var obj = normalize(e);
				
				window.setTimeout(function() { that.onsensordata({data : obj,timestamp:currentTimestamp, reason:"read"}); } ,0);
			}
		}

		function accelerationHandler(acc) {
			var obj = null;
			if (acc.xAxis) {
				obj = {
					x : -acc.xAxis,
					y : acc.yAxis,
					z : acc.zAxis
				};
			} else {
				obj = {
					x : -acc.x,
					y : acc.y,
					z : acc.z
				};
			}

			var ret = {
				data : obj
			};

			if (acc.timestamp) {
				ret.timestamp = acc.timestamp;
			}
			that.onsensordata(ret);
		}
		
		// Status attribute not implemented yet
		this.status = "open";
		
		function setStatus(newstatus) {
			if(that.status != newstatus) {
				that.status = newstatus;
				if(that.onstatuschange) {
					that.onstatuschange();
				}
			}
		}

		this.startWatch = function(options) {
			// if(this.status == "open") {
			if (navigator.accelerometer) {
				accel = navigator.accelerometer;
			} else if (window.deviceapis) {
				if (window.deviceapis.accelerometer) {
					accel = window.deviceapis.accelerometer;
				}
			}

			if (accel) {
				watchId = accel.watchAcceleration(accelerationHandler, this.onerror, {
					frequency : options.interval,
					minNotificationInterval : options.interval
				});
			} else if (window.DeviceMotionEvent) {
				if(options.interval) {
					interval = options.interval;
				}
				window.addEventListener('devicemotion', deviceMotionHandler,
						false);
			} else {
				if (this.onerror) {
					this.onerror("No accelerometer found");
				}
			}
		};

		this.endWatch = function() {
			if (accel && watchId) {
				accel.clearWatch(watchId);
			} else if (window.DeviceMotionEvent) {
				window.removeEventListener('devicemotion', deviceMotionHandler);
			}
		};
		
		this.read = function() {
			if (navigator.accelerometer) {
				accel = navigator.accelerometer;
			} else if (window.deviceapis) {
				if (window.deviceapis.accelerometer) {
					accel = window.deviceapis.accelerometer;
				}
			}

			if (accel) {
				accel.getCurrentAcceleration(accelerationHandler, this.onerror);
			} else if (window.DeviceMotionEvent) {
				readRequested = true;
				window.addEventListener('devicemotion', deviceMotionReader,
						false);
			} else {
				if (this.onerror) {
					this.onerror("No accelerometer found");
				}
			}
		};
	}; // navigator.sensors.accelerometer
} // if(navigator.sensors.accelerometer)

if (!navigator.sensors.orientation) {
	navigator.sensors.orientation = new function() {
		var watchId = null;
		var orient = null;
		var that = this;
		var oldTimestamp = null;
		var interval = null;
		var readRequested = false;
		
		function deviceOrientationReader(e) {
			window.console.log("Orientation Reader Event Received: " + e);
			
			if(readRequested) {
				window.console.log("Read had been requested previously");
				
				var currentTimestamp = new Date().getTime();
				var obj = normalizeOrientation(e);
			
				if(obj) {
					readRequested = false;
					window.setTimeout(function() { window.removeEventListener("deviceorientation",deviceOrientationReader); },0);
					window.setTimeout(
							function() { that.onsensordata({data : obj,
									timestamp:currentTimestamp,
									reason:"read"}); }
							,0);
				}
			}
			else {
				window.console.log("Read had not been requested. Do nothing");
			}
		}
		
		function normalizeOrientation(e) {
			var obj = {};

			if (e.beta || e.gamma || e.alpha) {
				obj.alpha = e.alpha;
				obj.beta = e.beta;
				obj.gamma = e.gamma;
			} else if (e.x) {
				obj.gamma = -(e.x * (180 / Math.PI));
				obj.beta = -(e.y * (180 / Math.PI));
				obj.alpha = null;
			}
			else obj = null;
			
			return obj;
		}

		function deviceOrientationHandler(e) {
			// window.console.log("device orientation invoked" + e.beta);
			// Here we normalize to the corresponding values
			
			window.console.log("Orientation Handler Event Received: " + e);

			var currentTimestamp = new Date().getTime();
			if (!oldTimestamp || !interval || currentTimestamp - oldTimestamp >= interval) {

				var obj = normalizeOrientation(e);
				
				if(obj) {
					oldTimestamp = currentTimestamp;
					window.setTimeout(
							function() { that.onsensordata(
									{data : obj,
									timestamp:currentTimestamp,
									reason:"watch"}); },0);
				}
			}
		}

		function wacOrientationHandler(orev) {
			that.onsensordata({
				data : orev
			});
		}

		function compassHandler(heading) {
			var obj = {};
			if(heading.magneticHeading) { 
				obj.alpha = heading.magneticHeading;
			}
			else { obj.alpha = heading; }

			obj.beta = null;
			obj.gamma = null;

			that.onsensordata({
				data : obj,
				timestamp : heading.timestamp
			});
		}

		this.read = function() {
			if (navigator.compass) {
				navigator.compass.getCurrentHeading(compassHandler,
						this.onerror);
			} else if (window.deviceapis) {
				if (window.deviceapis.orientation) {
					var sorient = window.deviceapis.orientation;
					sorient.getCurrentOrientation(wacOrientationHandler, this.onerror);
				}
			} else if (window.DeviceOrientationEvent) {
				window.console.log("Read: DeviceOrientation event exists");
				
				readRequested = true;
				window.addEventListener('deviceorientation',
						deviceOrientationReader, false);
			} else {
				if (this.onerror) {
					this.onerror("Orientation not available");
				}
			}
		};

		this.startWatch = function(options) {
			if (navigator.compass) {
				orient = navigator.compass;
				watchId = navigator.compass.watchHeading(compassHandler,
						this.onerror, {
							frequency : options.interval
						});
			} else if (window.deviceapis) {
				if (window.deviceapis.orientation) {
					orient = window.deviceapis.orientation;
					watchId = orient.watchOrientation(wacOrientationHandler,
							this.onerror, {
								minNotificationInterval : options.interval
							});
				}
			} else if (window.DeviceOrientationEvent) {
				window.console.log("Device Orientation Event is present");
				
				if(options.interval) {
					interval = options.interval;
				}

				window.addEventListener('deviceorientation',
						deviceOrientationHandler, false);
			} else if (window.OrientationEvent) {
				
				if(options.interval) {
					interval = options.interval;
				}

				window.addEventListener('MozOrientation',
						deviceOrientationHandler, false);
			} else {
				if (this.onerror) {
					this.onerror("Orientation not available");
				}
			}
		};

		this.endWatch = function() {
			if (orient && watchId) {
				orient.clearWatch(watchId);
				watchId = null;
			} else if (window.DeviceOrientationEvent) {
				window.removeEventListener('deviceorientation',
						deviceOrientationHandler);
			} else if (window.OrientationEvent) {
				window.removeEventListener('MozOrientation',
						deviceOrientationHandler);
			}
		};
	}; // navigator.sensors.orientation
} // if navigator.sensors.orientation
