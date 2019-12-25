let xVelocity = 1;
let yVelocity = 1;

let wl = 140;
let hl = 140;

let ws = 800;
let hs = 600;

let x = 0;
let y = 0;

let rate = 5; // change if you want it to go faster

let period, t, start;

let corner1, corner2;

function gcd(a, b) {
	if (!b) {
		return a;
	}

	return gcd(b, a % b);
}

function lcm(a, b) {
	return Math.abs(a * b) / gcd(a, b);
}

let W0 = ws - wl;
let H0 = hs - hl;

console.log("W0 " + W0);
console.log("H0 " + H0);
console.log("gcd " + gcd(W0, H0));
console.log("lcm wl hl " + lcm(W0, H0));

if (Math.abs(x - y) % gcd(W0, H0) === 0) {
	// corners will be reached
	if ((Math.abs(x - y) / gcd(W0, H0)) % 2 === 0) {
		corner1 =
			((lcm(W0, H0) / H0) % 2 === 0 ? "T" : "B") +
			((lcm(W0, H0) / W0) % 2 === 0 ? "L" : "R");
		corner2 = "TL";

		console.group("corner-1");
		console.log(corner1);
		console.groupEnd("corner-1");

		console.group("corner 2");
		console.log(corner2);
		console.groupEnd("corner-2");
	} else {
		corner1 =
			((lcm(W0, H0) / H0) % 2 !== 0 ? "T" : "B") +
			((lcm(W0, H0) / W0) % 2 !== 0 ? "L" : "R");
		corner2 = "BR";

		console.group("corner-1");
		console.log(corner1);
		console.groupEnd("corner-1");

		console.group("corner 2");
		console.log(corner2);
		console.groupEnd("corner-2");
	}
} else {
	console.log("No corner!");
}

function animate() {
	// reqAnimFrame =
	// 	window.requestAnimationFrame ||
	// 	window.mozRequestAnimationFrame ||
	// 	window.webkitRequestAnimationFrame ||
	// 	window.msRequestAnimationFrame ||
	// 	window.oRequestAnimationFrame;

	// reqAnimFrame(animate);

	for (let i = 0; i < rate; i++) {
		x += xVelocity;
		y += yVelocity;

		if (y + hl === hs && x + wl === ws) {
			// debugger;
			console.log("bottom right");
		}
		if (y + hl === hs && y === 0) {
			console.log("bottom left");
		}
		if (x === 0 && x + wl === ws) {
			console.log("top right");
		}
		if (x === 0 && y === 0) {
			console.log("top left");
		}

		// Right
		if (x + wl === ws) {
			if (!t) {
				t = new Date().getTime() - start;
			}
			xVelocity = -xVelocity;
		}
		// Left
		if (y === 0) {
			yVelocity = -yVelocity;
		}
		// Bottom
		if (y + hl === hs) {
			yVelocity = -yVelocity;
		}
		// Top
		if (x === 0) {
			xVelocity = -xVelocity;
		}
	}

	draw();
}

function draw() {
	let canvas = document.getElementById("c");
	let context = canvas.getContext("2d");
	context.clearRect(0, 0, ws, hs);
	context.fillStyle = "#000000";
	context.fillRect(0, 0, ws, hs);
	context.fillStyle = "#00ff00";
	context.fillRect(x, y, wl, hl);

	if (t) {
		period = (t * lcm(W0, H0)) / W0;
		context.fillStyle = "#ff0000";
		context.font = "18px Courier New";
		let timeToImpact =
			(period - ((new Date().getTime() - start) % period)) / 1000 + " s.";
		context.fillText(
			`Period: ${corner1 ? period / 1000 + "s." : "None"}
				Corner 1: ${corner1 || "None"}
				Corner 2: ${corner2 || "None"}
				Impact T-${corner1 ? timeToImpact : "None"}`,
			10,
			20
		);
		// debugger;
	}
}

let ctx = document.getElementById("c").getContext("2d");
ctx.canvas.width = ws;
ctx.canvas.height = hs;

// animate();
start = new Date().getTime();
setInterval(animate, 1000 / 60);
