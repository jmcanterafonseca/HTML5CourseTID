/**
 *  Accelerometer Compliance WAC App
 * 
 *  Author: José Manuel Cantera (Telefónica)
 *  
 *  This work has been inspired by the Accelerometer Play Application provided as 
 *  an example by the Android 2.3 SDK
 *  
 *  
 */

if(!window.particle) {
	window.particle = {
		// Canvas context
		ctx: null,
		// All the magnitudes are in the International System of Units
		params: {
			ballDiameter: 0.004,
			dpix: null,
			dpiy: null,
			metersToPixelsx: null,
			metersToPixelsy: null,
			resWidth: null, 
			resHeight: null,
			// bounds of the table
			horizBound: null,
			vertBound: null,
			// Origin of the reference coordinate system
			originx: null, 
			originy: null,
			// Friction Factor
			friction: 0.1,
			ballMass: 1000.0,
			dstw: null,
			dsth: null,
			img: null
		},
		acceleration: {
			ax: null, // The x-axis acceleration provided by the sensor
			ay: null // The y-axis acceleration provided by the sensor
		},
		position: {
			posx: 0.0,
			posy: 0.0,
			lastPosx: 0.0,
			lastPosy: 0.0
		},
		time: {
			lastT: 0.0,
			lastDeltaT: 0.0
		},
		initialize: function() {
			
			this.params.img = ele("theBall");
			
			this.computeResolutions();
		    			
		},
		paintBall: function() {
			// wacConsole.log("Painting the ball");
			
			var prm = this.params;
			var pos = this.position;
			
			var oldx = prm.originx + (pos.lastPosx * prm.metersToPixelsx);
			var oldy = prm.originy - (pos.lastPosy * prm.metersToPixelsy);
			
			this.ctx.clearRect(oldx - prm.dstw / 2,oldy  - prm.dsth / 2,prm.dstw,prm.dsth);
			
			this.ctx.beginPath();
			
			var x = prm.originx + (pos.posx * prm.metersToPixelsx);
			var y = prm.originy - (pos.posy * prm.metersToPixelsy);	
						 
			this.ctx.drawImage(prm.img,x - prm.dstw / 2,y - prm.dsth / 2,prm.dstw,prm.dsth);
			
			// wacConsole.log("Ball painted");
		},
		// The new position of the object is calculated in accordance with Verlet  
		// x(t + dt) = x(t) + (x(t) - x(t - dt)) * (dt / dt_prev) + a(t) / dt ^2
		computeNextPosition: function(accelx,accely,deltaT,deltaTC) {
			var s = this.position;
			
			var dt2 = deltaT * deltaT; 
				
			// x(t + dt) 
			var x = s.posx + (s.posx - s.lastPosx) * deltaTC + accelx * dt2;
			// y(t + dt) 
			var y = s.posy + (s.posy - s.lastPosy) * deltaTC + accely * dt2;
			
			s.lastPosx = s.posx;
			s.lastPosy = s.posy;
				
			s.posx = x;
			s.posy = y; 
				
			// wacConsole.log("(" + s.posx.toFixed(2) + "," + s.posy.toFixed(2) + ")");
				
			this.collisions();
		},
		collisions: function() {
			var s = this.position;
			
			var x = s.posx;
			var y = s.posy;
				
			var xmax = this.params.horizBound;
			var ymax = this.params.vertBound;
				
			if(x > xmax) {
				s.posx = xmax;
			}			
			else if(x < -xmax) {
					s.posx = -xmax;
			}
				
			if(y > ymax) {
				s.posy = ymax;
			}
			else if(y < -ymax) {
					s.posy = -ymax;
			}
		},
		// Executed when acceleration changes
		onacceleration: function(accel) {
			this.acceleration.ax = accel.x;
			this.acceleration.ay = accel.y;
			
			/*
			wacConsole.log("(" + accel.xAxis.toFixed(2) + "," + 
					accel.yAxis.toFixed(2) + "," + accel.zAxis.toFixed(2) + ")");
			*/
			this.moveTheBall();
		},
		// Moves the ball
		moveTheBall: function() {
			// Time and acceleration variables are prepared
			var t = new Date().getTime();
			
			var accelx = - this.acceleration.ax;
			var accely = - this.acceleration.ay;
				
			if(this.time.lastT != 0) {
				var deltaT = (t - this.time.lastT) * (1.0 / 1000.0);
				if(this.time.lastDeltaT != 0) {
					var deltaTC = deltaT / this.time.lastDeltaT;
					this.computeNextPosition(accelx,accely,deltaT,deltaTC);
				}
				
				this.time.lastDeltaT = deltaT;
			}	
			
			this.time.lastT = t;
			
			this.paintBall();
		},
		setupCanvas: function() {
			ele("cv").width = this.params.resWidth;
			// wacConsole.log("clientWidth:" + document.documentElement.clientWidth);
			// wacConsole.log("clientHeight:" + document.documentElement.clientHeight);
			
			var ch = document.documentElement.clientHeight;
			if(this.params.resWidth > 320) {
				ch = ch * 1.5;
			}
			ele("cv").height =  ch;
			
			this.params.vertBound = (( (ele("cv").height) / this.params.metersToPixelsy - this.params.ballDiameter) * 0.5);
			
			this.ctx = document.getElementsByTagName("canvas")[0].getContext("2d");	
			
			this.params.originx = this.params.resWidth / 2;
			this.params.originy = ele("cv").height / 2;
			
			this.params.dstw = 
					this.params.ballDiameter * this.params.metersToPixelsx + 0.5;
			this.params.dsth = 
					this.params.ballDiameter * this.params.metersToPixelsy + 0.5;
		},
		
		computeResolutions: function() {
			var pars = this.params;
			
			pars.resWidth = window.innerWidth;
			pars.resHeight = window.innerHeight;
			
			var e = document.body.appendChild(document.createElement('DIV'));
			e.style.width = '1in'; // 1in
			e.style.height = '1in';
			e.style.padding = '0';
			var dpix = e.offsetWidth;
			var dpiy = e.offsetHeight;
			e.parentNode.removeChild;
			
			pars.dpix = dpix;
			pars.metersToPixelsx = pars.dpix / 0.0254;
			
			pars.dpiy = dpiy;
			pars.metersToPixelsy = pars.dpiy / 0.0254;
			
			pars.horizBound = ((pars.resWidth / pars.metersToPixelsx - pars.ballDiameter) * 0.5);
			
			window.console.log(pars.resWidth);
			window.console.log(pars.resHeight);
			window.console.log(pars.dpix);
			window.console.log(pars.dpiy);
			
			this.setupCanvas();
			this.paintBall();
		},
		
		startSystem: function() {
			this.initialize();
			
			// wacConsole.log("Initialized ok !!");
		}
	}
} // particle


window.onload = function() {		
	window.particle.startSystem();
	
	watchAcceleration();
}

function error(e) {
	alert(e);
}

function watchAcceleration() {
	navigator.sensors.accelerometer.onsensordata = function(e) {
		window.particle.onacceleration(e.data);
	};
	
	navigator.sensors.accelerometer.onerror = function(e) {
		alert(e);
	};
	
	navigator.sensors.accelerometer.startWatch({interval:200});
}

function resReady(values) {
	window.particle.resReady(values);
}