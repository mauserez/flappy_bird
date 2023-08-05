class GameFunctions {
	browserDetect = () => {
		const userAgent = navigator.userAgent;
		let browserName;

		if (userAgent.match(/chrome/i)) {
			browserName = "chrome";
		} else {
			browserName = "safari";
		}

		return browserName;
	};

	preloadBirdImages = () => {
		const directions = [-1, 0, 1];
		const birdStates = [0, 1, 2];
		this.birdImages = {};

		directions.forEach((i) => {
			this.birdImages[i] = { 0: null, 1: null, 2: null };
			birdStates.forEach((j) => {
				const img = new Image();
				img.src = `/birdSprites/${i}-${j}.png`;
				this.birdImages[i][j] = img;
			});
		});
	};

	preloadPlaneImages = () => {
		this.planeImages = {};

		for (let i = 1; i <= 5; i++) {
			const img = new Image();
			img.src = `/planeSprites/${i}.png`;
			this.planeImages[i] = img;
		}
	};

	setBirdDirection = () => {
		/*
			если отрицательный то будет -1
			если нейтральное то будет 0
			если положительный то будет 1

			Нужно для отрисовки состояний птицы
			В Class Bird
		*/
		this.birdYDirection =
			this.fallIndex > -1 && this.fallIndex < 1
				? 0
				: -this.fallIndex / Math.abs(this.fallIndex);
	};

	addScore = (pipe) => {
		if (
			pipe.x < this.bird.x - this.pipes.size.width &&
			pipe.x >= this.bird.x - this.pipes.size.width - this.speed
		) {
			this.score++;
			this.sounds.score.playSound();

			/*
			Увеличим скорость. Первая цель 10 очков
			Следующая цель = текущая * 2
			*/
			if (this.score > this.target) {
				this.speed += 0.25;
				this.target = this.target * 2;
			}

			this.setScoreInScoreBlock();
		}
	};

	setScoreInScoreBlock() {
		if (this.scoreBlock !== null) {
			const splitScore = this.score.toString().padStart(4, 0).split("");

			[...this.scoreBlock.querySelectorAll("div > span")].forEach((el, idx) => {
				el.innerHTML = splitScore[idx];
			});
		}
	}

	setNewPlaneSettings = () => {
		this.plane = this.getRandomIntInclusive(1, 5);
		this.planeX = 1000;
		this.planeY = this.getRandomIntInclusive(0, 400);
	};

	movePlane = () => {
		this.planeX > -1000
			? (this.planeX -=
					this.cloudSpeed * 1.1 * this.planeSettings[this.plane].speed)
			: this.setNewPlaneSettings();
	};

	movePipes = () => {
		this.pipesXCoordinates.forEach((coordinates, idx) => {
			this.pipesXCoordinates[idx].x -= this.speed;

			if (coordinates.x < 0 - this.pipes.size.width) {
				this.addNewPipe();
				this.pipesXCoordinates.splice(idx, 1);
			}
		});
	};

	addNewPipe = () => {
		const lastPipeCoordinates =
			this.pipesXCoordinates[this.pipesXCoordinates.length - 1];

		const randomNextPipeY =
			lastPipeCoordinates.y + this.getRandomIntInclusive(-300, 300);

		const calcY =
			randomNextPipeY > this.maxTopPipeY ? this.maxTopPipeY : randomNextPipeY;

		const topPipeYstart = this.getRandomIntInclusive(
			this.minTopPipeY,
			calcY < this.minTopPipeY ? this.maxTopPipeY - 150 : calcY
		);

		this.pipesXCoordinates.push({
			x: this.canvas.width + this.pipeSize.width / 3,
			y: topPipeYstart,
		});
	};

	crashTopPipe = (topPipe) => {
		if (
			this.birdY >= topPipe.y &&
			this.birdY <= topPipe.yEnd - this.birdSize.height / 6
		) {
			return true;
		}

		return false;
	};

	crashBottomPipe = (bottomPipe) => {
		if (
			this.bird.y >=
				bottomPipe.y - this.birdSize.height + this.birdSize.height / 6 &&
			this.bird.y <= bottomPipe.yEnd
		) {
			return true;
		}

		return false;
	};

	сrashYAxis = (pipeSettings) => {
		if (
			this.crashTopPipe(pipeSettings.topPipe) ||
			this.crashBottomPipe(pipeSettings.bottomPipe)
		) {
			return true;
		}

		return false;
	};

	сrashXAxis = (pipeSettings) => {
		//Проверяем в пределах трубы
		if (
			//Начало трубы
			this.bird.x >=
				pipeSettings.topPipe.x -
					this.pipes.size.width / 2 +
					this.birdSize.width / 10 &&
			//Конец трубы
			this.bird.x <=
				pipeSettings.topPipe.x +
					this.pipes.size.width / 2 +
					this.birdSize.width / 1.6
		) {
			return true;
		}

		return false;
	};

	crashGround = () => {
		if (
			this.bird.y >=
			this.canvas.height - this.bird.size.height - this.sandHeigth
		) {
			return true;
		}

		return false;
	};

	birdCrash = (pipeSettings) => {
		if (
			(this.сrashXAxis(pipeSettings) && this.сrashYAxis(pipeSettings)) ||
			this.crashGround()
		) {
			this.doGameOver();
		}
	};

	birdRising = () => {
		this.fallIndex = -4.5;
		this.birdY = this.birdY - 7;
	};

	birdFalling = () => {
		this.birdYTurnPoint = this.canvas.height;
		this.birdY = this.birdY + 3 + this.fallIndex;
		this.fallIndex += 0.4;
	};

	topBirdStep = () => {
		return this.birdY - this.birdStep < 0 ? this.birdY - 10 : this.birdStep;
	};

	birdJump = () => {
		if (this.gameOver === false && this.started === true) {
			this.sounds.flap.playSound();
			this.birdYTurnPoint = this.birdY - this.topBirdStep();
			this.birdYDirection = "up";
		}
	};

	controllersInit = () => {
		this.canvas.addEventListener("mouseover", () => {
			this.clickEventListener = addEventListener("click", (event) => {
				if (this.started === false) {
					this.startGame();
					this.sounds.game.play();
				} else {
					this.birdJump();
				}

				if (this.gameOver === true) {
					let x = event.pageX - this.canvas.elemLeft,
						y = event.pageY - this.canvas.elemTop;
					if (x >= 90 && x <= 350 && y >= 590 && y <= 690) {
						this.init();
						this.startGame();
					}
				}
			});
		});

		document.getElementById("canvas").addEventListener("mouseover", () => {
			this.canvas.removeEventListener("click", this.clickEventListener);
		});

		this.canvas.removeEventListener("click", this.clickEventListener);

		window.onkeyup = (e) => {
			if (e.code === "ArrowUp") {
				this.birdJump();
			}

			if (e.code === "Enter") {
				if (this.started === true && this.gameOver === false) {
					this.togglePause();
				}
			}
		};
	};

	togglePause = () => {
		if (this.pause) {
			this.render();
			this.startCount();
			this.sounds.game.play();
		} else {
			this.pauseStartCount();
			this.stopGame();
		}

		this.pause = !this.pause;
	};

	startCount = () => {
		if (this.secondsToStart >= 0) {
			this.startCounter = setInterval(() => {
				this.secondsToStart--;
				if (this.secondsToStart === 0) {
					this.startCount();
				}
			}, 1000);

			const counterId = this.startCounter;
			setTimeout(() => {
				clearInterval(counterId);
			}, 4000);
		}
	};

	pauseStartCount = () => {
		if (this.secondsToStart >= 0) {
			clearInterval(this.startCounter);
		}
	};

	startGame = () => {
		if (this.started === false) {
			this.togglePause();
			this.started = true;
		}
	};

	stopGame = () => {
		window.clearTimeout(this.animationTimeout);
		window.cancelAnimationFrame(this.animationId);
		this.sounds.game.stop();
	};

	doGameOver = () => {
		this.gameOver = true;
		this.sounds.crash.play();

		this.bestScore = this.bestScore > this.score ? this.bestScore : this.score;
		localStorage.setItem("bestScore", this.bestScore);

		this.stopGame();

		setTimeout(() => {
			this.sounds.gameOver.play();
		}, 500);

		this.renderer.renderResult();
		this.renderer.renderRestartButton();
	};

	getRandomIntInclusive = (min, max) => {
		min = Math.ceil(min);
		max = Math.floor(max);

		return Math.floor(Math.random() * (max - min + 1) + min);
	};
}
