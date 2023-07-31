class GameFunctions {
	addScore() {
		if (
			this.pipeX < this.bird.x - this.pipes.size.width &&
			this.pipeX >= this.bird.x - this.pipes.size.width - this.speed
		) {
			this.score++;
			//Каждые 100 очков + 1 скорость
			this.speed += 0.01;
			if (this.scoreBlock !== null) {
				const splitScore = this.score.toString().padStart(4, 0).split("");

				[...this.scoreBlock.querySelectorAll("div > span")].forEach(
					(el, idx) => {
						el.innerHTML = splitScore[idx];
					}
				);
			}
		}

		this.setNewPipeSettings();

		/* if (
			this.pipeX > this.canvas.width &&
			this.pipeX <= this.canvas.width + this.speed
		) {
			this.pipeGap -= 5;
		} */
	}

	setNewPlaneSettings() {
		this.plane = `plane${this.getRandomIntInclusive(1, 5)}`;
		this.planeSrc = `${this.plane}.png`;
		this.planeX = 1000;
		this.planeY = this.getRandomIntInclusive(0, 400);
	}

	movePlane() {
		this.planeX > -1000
			? (this.planeX -=
					this.cloudSpeed * 1.1 * this.planeSettings[this.plane].speed)
			: this.setNewPlaneSettings();
	}

	setNewPipeSettings(force = false) {
		if (this.pipeX > 431 || force === true) {
			this.topPipeY = this.getRandomIntInclusive(
				this.minTopPipeY,
				this.maxTopPipeY
			);
		}
	}

	movePipes() {
		this.pipeX -=
			this.pipeX < 0 - this.pipes.size.width
				? -this.canvas.width - this.pipes.size.width * 1.5
				: this.speed;
	}

	crashTopPipe() {
		if (
			this.birdY >= this.pipes.topPipe.y + this.birdSize.height &&
			this.birdY <= this.pipes.topPipe.yEnd - 2
		) {
			return true;
		}

		return false;
	}

	crashBottomPipe() {
		if (
			this.bird.y >= this.pipes.bottomPipe.y - this.birdSize.height - 2 &&
			this.bird.y <= this.pipes.bottomPipe.yEnd
		) {
			return true;
		}

		return false;
	}

	сrashYAxis() {
		if (this.crashTopPipe() || this.crashBottomPipe()) {
			return true;
		}

		return false;
	}

	сrashXAxis() {
		if (
			this.bird.x >= this.pipes.x - this.pipes.size.width / 2 &&
			this.bird.x <= this.pipes.x + this.pipes.size.width
		) {
			return true;
		}
		return false;
	}

	crashGround() {
		if (
			this.bird.y >=
			this.canvas.height - this.bird.size.height - this.sandHeigth
		) {
			return true;
		}
		return false;
	}

	birdCrash() {
		if ((this.сrashYAxis() && this.сrashXAxis()) || this.crashGround()) {
			this.bestScore =
				this.bestScore > this.score ? this.bestScore : this.score;
			localStorage.setItem("bestScore", this.bestScore);

			window.cancelAnimationFrame(this.animationId);
			this.renderer.renderResult();
		}
	}

	birdRising() {
		this.fallIndex = -4.5;
		this.birdY = this.birdY - 6;
	}

	birdFalling() {
		this.birdYTurnPoint = this.canvas.height;
		this.birdY = this.birdY + 3 + this.fallIndex;
		this.fallIndex += 0.15;
	}

	topBirdStep() {
		return this.birdY - this.birdStep < 0 ? this.birdY - 10 : this.birdStep;
	}

	controllersInit() {
		window.onkeyup = (e) => {
			if (e.code === "ArrowUp") {
				this.birdYTurnPoint = this.birdY - this.topBirdStep();
				this.birdYDirection = "up";
			}

			if (e.code === "Enter") {
				this.togglePause();
			}
		};
	}

	togglePause() {
		if (this.pause) {
			this.render();
			this.startCount();
		} else {
			this.clearStartCount();
			window.cancelAnimationFrame(this.animationId);
		}

		this.pause = !this.pause;
	}

	startCount() {
		this.startCounter = setInterval(() => {
			this.secondsToStart--;
			console.log(this.secondsToStart);
		}, 1000);

		const counterId = this.startCounter;
		setTimeout(() => {
			clearInterval(counterId);
		}, 4000);
	}

	clearStartCount() {
		clearInterval(this.startCounter);
	}

	getRandomIntInclusive(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1) + min);
	}
}

class Renderer {
	constructor(game) {
		this.game = game;
		this.planeSpeed = 1;
		this.ctx = this.game.ctx;
		// объект, который хотим получить
		// из изображения-источника]
		this.bgSource = {
			x: 0,
			y: 0,
			width: this.game.canvas.width,
			height: this.game.canvas.height,
		};

		this.renderBackGroundPart1();
		this.renderBackGroundPart2();
		this.renderSand();
		this.renderPlane();
	}

	renderBackGroundPart1() {
		// объект, который хотим
		// отобразить на Canvas
		const bgPartOneResult = {
			x: this.game.backgroudX + this.game.canvas.width,
			y: 0,
			width: this.game.canvas.width,
			height: this.game.canvas.height,
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
			width: this.game.canvas.width,
			height: this.game.canvas.height,
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
			this.game.canvas.height - this.game.sandHeigth,
			this.game.canvas.width,
			this.game.sandHeigth
		);
	}

	renderPlane() {
		const planeImg = new Image();
		planeImg.src = this.game.planeSrc;
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

class Bird {
	constructor(game) {
		// ширина и высота птицы
		this.size = game.birdSize;
		this.x = game.birdX;
		this.y = game.birdY;
		this.yDirection = game.birdYDirection;
		this.game = game;

		this.drawBird();
	}

	// координаты, по которым птица
	// будет расположена на Canvas
	drawBird() {
		// изображение птицы, которое копируем
		// из изображения-источника
		const birdSource = {
			x: 432,
			y: Math.floor((this.game.flapIndex % 9) / 3) * 36,
			width: 51,
			height: 36,
		};

		const birdResult = {
			x: this.x,
			y: this.y,
			width: this.size.width,
			height: this.size.height,
		};

		this.game.ctx.drawImage(
			this.game.img,

			birdSource.x,
			birdSource.y,
			birdSource.width,
			birdSource.height,

			birdResult.x,
			birdResult.y,
			birdResult.width,
			birdResult.height
		);
	}
}

class Pipes {
	constructor(game) {
		// ширина и высота трубы
		this.x = game.pipeX;
		this.game = game;
		this.size = game.pipeSize;
		this.topPipeY = game.topPipeY;

		this.topPipe = {
			y: this.topPipeY,
			yEnd: this.topPipeY + this.size.height,
			height: this.size.height,
			source: {
				x: 432,
				y: 110,
			},
		};

		this.bottomPipeYStart =
			this.topPipeY + this.size.height + this.game.pipeGap;

		this.bottomPipe = {
			y: this.bottomPipeYStart,
			yEnd: this.bottomPipeYStart + this.size.height,
			height:
				this.game.canvas.height - this.bottomPipeYStart - this.game.sandHeigth,
			source: {
				x: 510,
				y: 108,
			},
		};

		this.drawPipe(this.topPipe);
		this.drawPipe(this.bottomPipe);
	}

	// координаты, по которым труба
	// будет расположена на Canvas
	drawPipe(pipeData) {
		// изображение трубы, которое копируем
		// из изображения-источника
		const pipeSource = {
			x: pipeData.source.x,
			y: pipeData.source.y,
			width: this.size.width,
			height: pipeData.height,
		};

		const pipeResult = {
			x: this.x,
			y: pipeData.y,
			width: this.size.width,
			height: pipeData.height,
		};

		this.game.ctx.drawImage(
			this.game.img,

			pipeSource.x,
			pipeSource.y,
			pipeSource.width,
			pipeSource.height,

			pipeResult.x,
			pipeResult.y,
			pipeResult.width,
			pipeResult.height
		);
	}
}

class FlappyBirdGame extends GameFunctions {
	constructor(canvasId, options, imgUrl) {
		super();
		this.canvas = document.getElementById(canvasId);
		this.ctx = canvas.getContext("2d");
		// объект изображения с ресурсами, которые будем
		// использовать для создания анимаций
		this.img = new Image();
		this.img.src = !imgUrl
			? "https://i.ibb.co/Q9yv5Jk/flappy-bird-set.png"
			: imgUrl;

		// Скорость игры
		this.speed = !options.speed ? 3 : options.speed;
		// Блок для отображения результата
		this.scoreBlock = !options.scoreBlock ? null : options.scoreBlock;

		//Скорость движения облаков
		this.cloudSpeed = 6;
		// координата по оси Х фонового изображения
		this.backgroudX = 0;
		this.sandHeigth = 30;

		// переменная, необходимая для расчёта
		// новых координат на каждом кадре
		this.index = 0;
		this.flapIndex = 0;
		this.secondsToStart = 3;

		this.birdSize = { width: 40, height: 28 };
		// Индекс ускорения падения птицы
		this.fallIndex = 0;

		// Гэп между трубами
		this.pipeGap = this.birdSize.height * 5;
		this.pipeSize = { width: 77, height: 479 };
		this.pipeX = this.canvas.width - 100;
		this.minTopPipeY = -this.pipeSize.height + 120;
		this.maxTopPipeY = 0;
		this.setNewPipeSettings(true);

		//Взаимодействия с птицей

		this.birdY = (this.canvas.height - this.birdSize.height) / 2;
		this.birdYTurnPoint = this.birdY;
		this.birdYDirection = "down";
		this.birdX = this.canvas.width / 2 - this.birdSize.width / 2 - 100;
		this.birdStep = this.pipeGap / 2 - this.birdSize.height;

		//Летающий декор начальные координаты
		this.setNewPlaneSettings();

		this.score = 0;
		this.bestScore = localStorage.getItem("bestScore") || 0;
		this.pause = true;

		//Инициация кнопок контроллеров
		this.controllersInit();

		//Рендерим и останавливаем
		this.togglePause();
	}

	planeSettings = {
		plane1: {
			speed: 0.3,
		},
		plane2: {
			speed: 0.2,
		},
		plane3: {
			speed: 0.9,
		},
		plane4: {
			speed: 1.2,
		},
		plane5: {
			speed: 1.5,
		},
	};

	// функция для отрисовки кадра
	render = () => {
		this.flapIndex += 0.6;

		this.renderer = new Renderer(this);
		this.bird = new Bird(this);
		this.pipes = new Pipes(this);

		/*
			При нажатии стрелки вверх меняется
			направление движения птицы по оси Y
			И появляется точка разворота
			к падению.
			Здесь мы проверяем достигнута эта точка или нет
		*/

		if (this.birdYTurnPoint <= this.birdY) {
			this.birdRising();
		} else {
			this.birdFalling();
		}

		if (this.secondsToStart >= 0) {
			this.renderer.renderCounter(this.secondsToStart);
		}

		if (this.secondsToStart <= 0) {
			this.index += 0.3;
			this.backgroudX = -((this.index * this.cloudSpeed) % this.canvas.width);

			this.movePipes();
			this.movePlane();
			this.addScore();
		}

		// после завершения расчётов для текущего кадра
		// сразу запускаем выполнение расчётов для следующего
		this.animationId = window.requestAnimationFrame(this.render);

		//Проверяем столкновение с трубами или с землей
		this.birdCrash();
	};
}
