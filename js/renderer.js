class Renderer {
	constructor(game) {
		this.game = game;
		this.planeSpeed = 1;
		this.canvas = this.game.canvas;
		this.ctx = this.game.ctx;
		// объект, который хотим получить
		// из изображения-источника]
		this.bgSource = {
			x: 0,
			y: 0,
			width: this.canvas.width,
			height: this.canvas.height,
		};

		if (this.game.started === true) {
			this.renderBackGroundPart1();
			this.renderBackGroundPart2();
			this.renderSand();
			this.renderPlane();
		} else {
			this.renderStartButton();
		}
	}

	renderBackGroundPart1() {
		// объект, который хотим
		// отобразить на Canvas
		const bgPartOneResult = {
			x: this.game.backgroudX + this.canvas.width,
			y: 0,
			width: this.canvas.width,
			height: this.canvas.height,
		};

		this.game.ctx.drawImage(
			this.game.img,

			this.bgSource.x,
			this.bgSource.y,
			this.bgSource.width,
			this.bgSource.height,

			bgPartOneResult.x,
			bgPartOneResult.y,
			bgPartOneResult.width,
			bgPartOneResult.height
		);
	}

	renderBackGroundPart2() {
		// вторая часть фонового изображения, которая
		// идёт следом за первой
		const bgPartTwoResult = {
			x: this.game.backgroudX,
			y: 0,
			width: this.canvas.width,
			height: this.canvas.height,
		};

		this.game.ctx.drawImage(
			this.game.img,

			this.bgSource.x,
			this.bgSource.y,
			this.bgSource.width,
			this.bgSource.height,

			bgPartTwoResult.x,
			bgPartTwoResult.y,
			bgPartTwoResult.width,
			bgPartTwoResult.height
		);
	}

	renderSand() {
		this.ctx.fillStyle = "#edc476";
		this.ctx.fillRect(
			0,
			this.canvas.height - this.game.sandHeigth,
			this.canvas.width,
			this.game.sandHeigth
		);
	}

	renderPlane() {
		const planeImg = this.game.planeImages[this.game.plane];
		this.ctx.drawImage(planeImg, this.game.planeX, this.game.planeY);
	}

	renderResult() {
		this.ctx.strokeStyle = "transparent";
		this.ctx.fillStyle = "#edc476";
		this.ctx.beginPath();
		this.ctx.roundRect(93, 200, 250, 350, [20]);
		this.ctx.stroke();
		this.ctx.fill();

		const gameOverText = "GAME OVER".split("").join(String.fromCharCode(8202));
		this.ctx.fillStyle = "#ff0000";
		this.ctx.font = "bold 110px Arcade,Helvetica,Arial,sans-serif";
		this.ctx.fillText(gameOverText, 70, 190, 300, 100);

		this.ctx.fillStyle = "#333";
		this.ctx.font = "bold 60px Arcade,Helvetica,Arial,sans-serif";
		this.ctx.fillText("SCORE", 140, 290, 200, 100);
		this.ctx.fillText("BEST", 156, 440, 300, 200);

		this.ctx.font = "bold 90px Arcade,Helvetica,Arial,sans-serif";
		const scorePad = {
			1: 6,
			2: 30,
			3: 48,
			4: 70,
		};

		this.ctx.fillText(
			`${this.game.score}`,
			205 - scorePad[this.game.score.toString().length],
			370,
			250,
			100
		);

		this.ctx.fillText(
			`${this.game.bestScore}`,
			205 - scorePad[this.game.bestScore.toString().length],
			520,
			250,
			100
		);
	}

	renderRestartButton() {
		this.ctx.strokeStyle = "transparent";
		this.ctx.fillStyle = "#edc476";
		this.ctx.beginPath();
		this.ctx.roundRect(93, 590, 250, 100, [20]);
		this.ctx.stroke();
		this.ctx.fill();

		const fontSize = this.game.browser === "safari" ? "36" : "48";
		const restartText = "RESTART".split("").join(String.fromCharCode(8202));
		this.ctx.fillStyle = "#ff0000";
		this.ctx.font = `bold ${fontSize}px Arcade,Helvetica,Arial,sans-serif`;
		this.ctx.fillText(restartText, 125, 660, 300, 100);
	}

	renderStartButton() {
		const arcadeFont = new FontFace("Arcade", "url(/fonts/arcade.regular.ttf)");
		arcadeFont
			.load()
			.then((font) => {
				document.fonts.add(font);
			})
			.then(() => {
				this.ctx.strokeStyle = "transparent";
				this.ctx.fillStyle = "#edc476";
				this.ctx.beginPath();
				this.ctx.roundRect(0, 0, this.canvas.width, this.canvas.height, [20]);
				this.ctx.stroke();
				this.ctx.fill();

				const fontSize = this.game.browser === "safari" ? "50" : "70";
				const startText = "START".split("").join(String.fromCharCode(8202));
				this.ctx.fillStyle = "#ff0000";
				this.ctx.font = `bold ${fontSize}px Arcade,Helvetica,Arial,sans-serif`;
				this.ctx.fillText(startText, 120, 420, 300, 100);
			});
	}

	renderCounter(secondsToStart) {
		this.ctx.fillStyle = "#fff";
		this.ctx.font = "bold 100px Arcade,Helvetica,Arial,sans-serif";
		if (secondsToStart > 0) {
			this.ctx.fillText(secondsToStart, 190, 430, 200, 100);
		} else {
			this.ctx.fillText("START", 125, 430, 200, 100);
		}
	}
}
