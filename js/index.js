/*
TODO
- Refactor to class
*/

let xVelocity = 1;
let yVelocity = 1;

let logoWidth = 140;
let logoHeight = 140;

let canvasWidth = 800;
let canvasHeight = 600;

let x = 0;
let y = 0;

let rate = 5; // change if you want it to go faster

let period, t, start;

let corner1, corner2;

/**
 * Return the largest number that divides to the two numbers (the greatest common denominator).
 *
 * @param {number} a First term
 * @param {number} b Second term
 * @returns {number} The greatest common denominator
 */
function gcd(a, b) {
	if (!b) {
		return a;
	}

	return gcd(b, a % b);
}

/**
 * Return the smallest number that is divisable by both terms (the lowest common multiple).
 *
 * @param {number} a First term
 * @param {number} b Second term
 * @returns {number} The lowest common multiple
 */
function lcm(a, b) {
	return Math.abs(a * b) / gcd(a, b);
}

let widthDiff = canvasWidth - logoWidth;
let heightDiff = canvasHeight - logoHeight;

console.log("Width Diff " + widthDiff);
console.log("Height Diff " + heightDiff);
console.log("gcd of WdthDiff and HgtDiff " + gcd(widthDiff, heightDiff));
console.log("lcm of WdthDiff and HgtDiff " + lcm(widthDiff, heightDiff));

if (Math.abs(x - y) % gcd(widthDiff, heightDiff) === 0) {
	// corners will be reached
	if ((Math.abs(x - y) / gcd(widthDiff, heightDiff)) % 2 === 0) {
		corner1 =
			((lcm(widthDiff, heightDiff) / heightDiff) % 2 === 0 ? "T" : "B") +
			((lcm(widthDiff, heightDiff) / widthDiff) % 2 === 0 ? "L" : "R");
		corner2 = "TL";

		console.group("corner-1");
		console.log(corner1);
		console.groupEnd("corner-1");

		console.group("corner 2");
		console.log(corner2);
		console.groupEnd("corner-2");
	} else {
		corner1 =
			((lcm(widthDiff, heightDiff) / heightDiff) % 2 !== 0 ? "T" : "B") +
			((lcm(widthDiff, heightDiff) / widthDiff) % 2 !== 0 ? "L" : "R");
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

/**
 * Update the position of the logo and detect collision of the logo with the walls.
 */
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

		// The logo is drawn from its top-right corner
		if (y + logoHeight === canvasHeight && x + logoWidth === canvasWidth) {
			// debugger;
			console.log("bottom right");
		}
		if (y + logoHeight === canvasHeight && y === 0) {
			console.log("bottom left");
		}
		if (x === 0 && x + logoWidth === canvasWidth) {
			console.log("top right");
		}
		if (x === 0 && y === 0) {
			console.log("top left");
		}

		// Right
		if (x + logoWidth === canvasWidth) {
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
		if (y + logoHeight === canvasHeight) {
			yVelocity = -yVelocity;
		}
		// Top
		if (x === 0) {
			xVelocity = -xVelocity;
		}
	}

	draw();
}

/**
 * Initialize the canvas and canvas elements.
 */
function draw() {
	let canvas = document.getElementById("mockScreen");
	let context = canvas.getContext("2d");
	context.clearRect(0, 0, canvasWidth, canvasHeight);
	context.fillStyle = "#000000";
	context.fillRect(0, 0, canvasWidth, canvasHeight);
	context.fillStyle = "#00ff00";
	context.fillRect(x, y, logoWidth, logoHeight);

	if (t) {
		period = (t * lcm(widthDiff, heightDiff)) / widthDiff;
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

let el = document.getElementById("mockScreen");
let ctx = el.getContext("2d");
ctx.canvas.width = canvasWidth;
ctx.canvas.height = canvasHeight;

// animate();
start = new Date().getTime();
setInterval(animate, 1000 / 60);
