/*
TODO
- Type hints?
*/

/**
 * Simulate a DVD logo bouncing on a TV screen. This predicts
 * which two corners it will hit first and how long it takes
 * between corner hits.
 */
class Logo {
	constructor(canvas, context, canvasWidth, canvasHeight, imgArr, rate) {
		this.canvas = canvas;
		this.context = context;

		this.imgIndex = 0;
		this.currImg = imgArr[this.imgIndex];
		this.imgArr = imgArr;

		this.x = 0;
		this.y = 0;

		this.xVelocity = 1;
		this.yVelocity = 1;

		this.logoWidth = imgArr[0].width;
		this.logoHeight = imgArr[0].height;

		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;

		this.rate = rate;

		this.period = null;
		this.t = null;
		this.start = null;

		this.corner1 = null;
		this.corner2 = null;

		this.widthDiff = this.canvasWidth - this.logoWidth;
		this.heightDiff = this.canvasHeight - this.logoHeight;

		console.log("Width Diff " + this.widthDiff);
		console.log("Height Diff " + this.heightDiff);
		console.log(
			"gcd of WdthDiff and HgtDiff " +
				this.gcd(this.widthDiff, this.heightDiff)
		);
		console.log(
			"lcm of WdthDiff and HgtDiff " +
				this.lcm(this.widthDiff, this.heightDiff)
		);

		this.findCorners();
	}

	/**
	 * Determine the first two corners the logo will hit if any.
	 */
	findCorners() {
		if (
			Math.abs(this.x - this.y) %
				this.gcd(this.widthDiff, this.heightDiff) ===
			0
		) {
			// corners will be reached
			if (
				(Math.abs(this.x - this.y) /
					this.gcd(this.widthDiff, this.heightDiff)) %
					2 ===
				0
			) {
				this.corner1 =
					((this.lcm(this.widthDiff, this.heightDiff) /
						this.heightDiff) %
						2 ===
					0
						? "T"
						: "B") +
					((this.lcm(this.widthDiff, this.heightDiff) /
						this.widthDiff) %
						2 ===
					0
						? "L"
						: "R");
				this.corner2 = "TL";

				console.group("corner-1");
				console.log(this.corner1);
				console.groupEnd("corner-1");

				console.group("corner 2");
				console.log(this.corner2);
				console.groupEnd("corner-2");
			} else {
				this.corner1 =
					((this.lcm(this.widthDiff, this.heightDiff) /
						this.heightDiff) %
						2 !==
					0
						? "T"
						: "B") +
					((this.lcm(this.widthDiff, this.heightDiff) /
						this.widthDiff) %
						2 !==
					0
						? "L"
						: "R");
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

		if (this.t) {
			this.period =
				(this.t * this.lcm(this.widthDiff, this.heightDiff)) /
				this.widthDiff;
			this.context.fillStyle = "#ff0000";
			this.context.font = "18px Courier New";
			let timeToImpact =
				(
					(this.period -
						((new Date().getTime() - this.start) % this.period)) /
					1000
				).toFixed(3) + " s.";
			const periodTxt = (this.period / 1000).toFixed(3);
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

			// debugger;
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

			let right = this.x + this.logoWidth === this.canvasWidth;
			let left = this.x === 0;

			let top = this.y === 0;
			let bottom = this.y + this.logoHeight === this.canvasHeight;

			// The logo is drawn from its top-left corner
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
				this.imgIndex = (this.imgIndex + 1) % this.imgArr.length;
				this.currImg = this.imgArr[this.imgIndex];
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
