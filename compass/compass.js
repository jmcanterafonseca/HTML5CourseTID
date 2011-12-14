/* TODO: Insert your custom JavaScript here */
function ele(id) {
	return document.getElementById(id);
}

if(!window.compass) {
	window.compass = {			
		init: function() {
			this.canvas = document.getElementsByTagName("canvas")[0];
			
			this.ctx = this.canvas.getContext("2d");
			
			this.calcParams();			
		},
		
		calcParams: function() {
			this.canvas.width = window.innerWidth;
			this.canvas.height = window.innerHeight;
			
			this.config.centerx = this.canvas.width / 2;
			this.config.centery = this.canvas.height / 2;
			
			this.config.radius =  this.config.centerx - 10;
		},
		
		currentRotation: 0.0,
		// Paints the compass
		paint: function() {
			
			this.paintCirc();
			
			this.paintCenter();
			
			this.paintRadials();

		},
		
		paintCirc: function() {
			var centerx = this.config.centerx;
			var centery = this.config.centery;
			var radius = this.config.radius;
			
			this.ctx.lineWidth = 2;
			
			this.ctx.beginPath();
			
			// The circumference (from 0 radians to 2PI radians)	
			this.ctx.arc(centerx,centery,radius,0,Math.PI * 2);	
			this.ctx.stroke();
		},
		
		paintRadials: function() {
			
			var ctx = this.ctx;
			var radius = this.config.radius;
			var centerx = this.config.centerx;
			var centery = this.config.centery;
			
			ctx.save();
			
			ctx.translate(centerx,centery);
			ctx.rotate(this.currentRotation);
			
			var next = 15;
			
			var cardinals = {
				"90": "E",
				"180" : "S",
				"270" : "W",
				"360" : "N"
			};
			
			for(var i = 0; i < 24; i++) {
				ctx.beginPath();
				
				ctx.rotate(Math.PI / 12.0);
				ctx.moveTo(0,-(radius - 7));
				ctx.lineTo(0,- radius);
				
				ctx.lineWidth = 2;
				ctx.stroke();

				ctx.lineWidth = 1;
				
				var label;
				var cardinal = false;
				if(next % 90 != 0) {
					label = next.toString();
				}
				else {
						label = cardinals[next.toString()];
						cardinal = true;
				}
				
				if((i+1) % 2 == 0) {
					ctx.save();
					
					if(cardinal) {
						ctx.font = "bold 12px sans-serif";
					}
					ctx.strokeText(label,-4,-(radius - 20));		
					
					ctx.restore();
				} 
				
				next += 15;
			}
			
			ctx.restore();			
		},
		
		paintCenter: function() {
			var centerx = this.config.centerx;
			var centery = this.config.centery;
			var radius = this.config.radius;
			var ctx = this.ctx;
			
			ctx.save();
			
			ctx.lineWidth = 1;
			
			ctx.translate(centerx,centery);
			ctx.rotate(this.currentRotation);
			
			ctx.beginPath();
			ctx.moveTo(0,0 - radius / 2);
			ctx.lineTo(0,0 + radius / 2);
			ctx.stroke();
			
			ctx.beginPath();
			ctx.moveTo(0 - radius / 2,0);					
			ctx.lineTo(0 + radius / 2,0);			
			ctx.stroke();
						
			for(var i = 0; i < 4; i++) {
				ctx.beginPath();		
				ctx.rotate(Math.PI / 2.0);

				ctx.moveTo(radius / 2,0);
				ctx.lineTo(8,-8);
				ctx.lineTo(0,0);
				ctx.lineTo(8,8);
				
				ctx.closePath();		
				ctx.stroke();
			}
				
			ctx.restore();
		},
		
		config: {
			radius: null,
			centerx: null,
			centery: null
		},
		
		invalidate: function() {
			var canvas = document.getElementsByTagName("canvas")[0];
			
			canvas.width = canvas.width;
		},
		
		ctx: null,
		canvas: null,
		orChange: function(rotation) {
			this.currentRotation = - ((Math.PI * rotation.data.alpha) / 180.0);
			this.invalidate();
			this.paint();
		}
	};
}

// To deal with landscape / portrait issues i.e. deals with screen orientation
window.onorientationchange = function() {
	
	window.compass.calcParams();
	window.compass.paint();
}

window.onload = function() {
	window.compass.init();
	window.compass.paint();
	
	if(!window.PhoneGap) {
		deviceready();
	}
};

function deviceready() {
	watchOrientation();
}

// Checks for device orientation 
function watchOrientation() {
	var orient = navigator.sensors.orientation;
	
	orient.onsensordata = orientationChange;
	orient.onerror = error;
	orient.startWatch({interval:500});
}


// When device orientation changes is executed
function orientationChange(rotation) {
	window.compass.orChange(rotation);
}


function error(e) {
	alert(e);
}