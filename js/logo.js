/*
TODO
- Use actual animation callbacks
*/

/**
 * Simulate a DVD logo bouncing on a TV screen. This predicts
 * which two corners it will hit first and how long it takes
 * between corner hits.
 */
class Logo {
	/**
	 * Create a Logo object
	 *
	 * @param {HTMLCanvasElement} canvas The empty canvas on the page
	 * @param {number} canvasWidth Width of the canvas to make
	 * @param {number} canvasHeight Height of the canvas to make
	 * @param {Array<HTMLImageElement>} imgMap Available sprites for the DVD logo
	 * @param {number} rate How fast to animate (not interval)
	 */
	constructor(canvas, canvasWidth, canvasHeight, colors, imgMap, rate) {
		this.canvas = canvas;
		/** @type {CanvasRenderingContext2D} */
		this.context = canvas.getContext("2d");

		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;

		this.imgMap = imgMap;

		this.rate = rate;

		/** @type {number} */
		this.x = 0;
		/** @type {number} */
		this.y = 0;

		/** @type {number} */
		this.xVelocity = 1;
		/** @type {number} */
		this.yVelocity = 1;

		this.colors = colors;

		/** @type {number} */
		this.colIndex = 0;
		this.currCol = this.colors[this.colIndex];
		this.currImg = this.imgMap[this.currCol];

		/** @type {number} */
		this.logoWidth = this.imgMap[this.currCol].width;
		/** @type {number} */
		this.logoHeight = this.imgMap[this.currCol].height;

		this.widthDiff = this.canvasWidth - this.logoWidth;
		this.heightDiff = this.canvasHeight - this.logoHeight;

		this.diffGcd = this.gcd(this.widthDiff, this.heightDiff);
		this.diffLcm = this.lcm(this.widthDiff, this.heightDiff);

		this.period = null;
		this.t = null;
		this.start = null;

		this.corner1 = null;
		this.corner2 = null;

		console.group("Differences");
		console.log("Width Diff " + this.widthDiff);
		console.log("Height Diff " + this.heightDiff);
		console.log("gcd of WdthDiff and HgtDiff " + this.diffGcd);
		console.log("lcm of WdthDiff and HgtDiff " + this.diffLcm);
		console.groupEnd("Differences");

		this.findCorners();
	}

	/**
	 * Determine the first two corners the logo will hit if any.
	 */
	findCorners() {
		let xyDiff = Math.abs(this.x - this.y);
		if (xyDiff % this.diffGcd === 0) {
			// corners will be reached
			console.group("Corners");
			if ((xyDiff / this.diffGcd) % 2 === 0) {
				this.corner1 =
					((this.diffLcm / this.heightDiff) % 2 === 0 ? "T" : "B") +
					((this.diffLcm / this.widthDiff) % 2 === 0 ? "L" : "R");
				this.corner2 = "TL";

				console.log(this.corner1);
				console.log(this.corner2);
			} else {
				this.corner1 =
					((this.diffLcm / this.heightDiff) % 2 !== 0 ? "T" : "B") +
					((this.diffLcm / this.widthDiff) % 2 !== 0 ? "L" : "R");
				this.corner2 = "BR";

				console.group("corner-1");
				console.log(this.corner1);
				console.groupEnd("corner-1");

				console.group("corner 2");
				console.log(this.corner2);
				console.groupEnd("corner-2");
			}
		} else {
			console.log("No corner!");
		}
		console.groupEnd("Corners");
	}

	/**
	 * Return the largest number that divides to the two numbers (the greatest common denominator).
	 *
	 * @param {number} a First term
	 * @param {number} b Second term
	 * @returns {number} The greatest common denominator
	 */
	gcd(a, b) {
		if (!b) {
			return a;
		}

		return this.gcd(b, a % b);
	}

	/**
	 * Return the smallest number that is divisable by both terms (the lowest common multiple).
	 *
	 * @param {number} a First term
	 * @param {number} b Second term
	 * @returns {number} The lowest common multiple
	 */
	lcm(a, b) {
		return Math.abs(a * b) / this.gcd(a, b);
	}

	/**
	 * Update canvas elements with the specified data.
	 */
	draw() {
		this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

		this.context.fillStyle = "#000000";
		this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

		this.context.drawImage(this.currImg, this.x, this.y);

		this.context.lineWidth = 2;
		this.context.strokeStyle = this.currCol;

		this.context.beginPath();
		this.context.moveTo(this.x, this.y);

		this.context.lineTo(this.x + this.currImg.width, this.y);
		this.context.lineTo(
			this.x + this.currImg.width,
			this.y + this.currImg.height
		);
		this.context.lineTo(this.x, this.y + this.currImg.height);
		this.context.lineTo(this.x, this.y);

		this.context.stroke();

		if (this.t) {
			this.period = (this.t * this.diffLcm) / this.widthDiff;
			this.context.fillStyle = "#ff0000";
			this.context.font = "18px Courier New";

			let deltaTime = new Date().getTime() - this.start;
			let periodsElapsed = deltaTime % this.period;

			let timeToImpact =
				((this.period - periodsElapsed) / 1000).toFixed(3) + " s.";

			let periodTxt = (this.period / 1000).toFixed(3);

			this.context.fillText(
				`Period: ${this.corner1 ? periodTxt + "s." : "None"}`,
				10,
				20
			);
			this.context.fillText(
				`Corner 1: ${this.corner1 || "None"}`,
				235,
				20
			);

			this.context.fillText(
				`Corner 2: ${this.corner2 || "None"}`,
				410,
				20
			);
			this.context.fillText(
				`Impact T-${this.corner1 ? timeToImpact : "None"}`,
				600,
				20
			);
		}
	}

	/**
	 * Update the position of the logo and detect collision of the logo with the walls.
	 */
	animate() {
		for (let i = 0; i < this.rate; i++) {
			this.x += this.xVelocity;
			this.y += this.yVelocity;

			let bounced = false;

			// The logo is drawn from its top-left corner
			let left = this.x === 0;
			let right = this.x + this.logoWidth === this.canvasWidth;

			let top = this.y === 0;
			let bottom = this.y + this.logoHeight === this.canvasHeight;

			if (bottom && right) {
				console.log("bottom right");
				bounced = true;
			}
			if (bottom && left) {
				console.log("bottom left");
				bounced = true;
			}
			if (top && right) {
				console.log("top right");
				bounced = true;
			}
			if (top && left) {
				console.log("top left");
				bounced = true;
			}

			// Right
			if (right) {
				if (!this.t) {
					this.t = new Date().getTime() - this.start;
				}
				this.xVelocity = -this.xVelocity;
				bounced = true;
			}
			if (top) {
				this.yVelocity = -this.yVelocity;
				bounced = true;
			}
			if (bottom) {
				this.yVelocity = -this.yVelocity;
				bounced = true;
			}
			if (left) {
				this.xVelocity = -this.xVelocity;
				bounced = true;
			}

			if (bounced) {
				this.colIndex = (this.colIndex + 1) % this.colors.length;
				this.currCol = this.colors[this.colIndex];
				this.currImg = this.imgMap[this.currCol];
			}
		}

		this.draw();
	}

	/**
	 * Begin the animation
	 */
	startAnim() {
		this.start = new Date().getTime();
		setInterval(() => {
			this.animate();
		}, 1000 / 60);
	}
}
