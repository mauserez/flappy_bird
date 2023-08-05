class FlappyBirdGame extends GameFunctions {
	constructor(canvasId, options, imgUrl) {
		super();
		this.browser = this.browserDetect();
		this.options = options;
		this.sounds = new GameSounds();

		this.birdSize = { width: 41, height: 36 };
		this.canvas = document.getElementById(canvasId);
		this.canvas.elemLeft = this.canvas.offsetLeft + this.canvas.clientLeft;
		this.canvas.elemTop = this.canvas.offsetTop + this.canvas.clientTop;
		this.ctx = canvas.getContext("2d");
		this.renderer = new Renderer(this);
		this.planes = new Planes();

		//Загружаем картинки птицы
		this.preloadBirdImages();
		//Загружаем картинки дополнительных летающих объектов
		this.preloadPlaneImages();

		// объект изображения с ресурсами, которые будем
		// использовать для создания анимаций
		this.img = new Image();
		this.img.src = !imgUrl
			? "https://i.ibb.co/Q9yv5Jk/flappy-bird-set.png"
			: imgUrl;

		// Блок для отображения результата
		this.scoreBlock =
			this.options.scoreBlock === undefined ? null : this.options.scoreBlock;

		/*
			Если браузер лагает или наоборот дает FPS > 100
			Как например на MacBook
			Ставим 60 это дефолт

			Причем я посмотрел много статей на эту тему
			И нормального решения нет
			requestAnimationFrame не идеален.

			Все делается либо через setTimeout либо через setInterval
			Нельзя тупо зафорсить 60 кадров

			А еще в разных браузерах тоже работает по разному
		*/
		this.fps = this.browser === "safari" ? 66 : 60;

		//Инициация кнопок контроллеров
		this.controllersInit();
		this.init();
	}

	init = () => {
		// Скорость игры
		this.speed = this.options.speed === undefined ? 3 : this.options.speed;
		this.speed = this.browser === "safari" ? this.speed / 1.2 : this.speed;
		//Скорость движения облаков
		this.cloudSpeed = 6;
		// координата по оси Х фонового изображения
		this.backgroudX = 0;
		this.sandHeigth = 30;
		this.planeSettings = this.planes.getSettings();

		// переменная, необходимая для расчёта
		// новых координат на каждом кадре
		this.index = 0;
		this.flapIndex = 0;
		this.secondsToStart = 3;

		// Индекс ускорения падения птицы
		this.fallIndex = 0;

		// Гэп между трубами
		this.pipeGap = this.birdSize.height * 5;
		this.pipeSize = { width: 77, height: 479 };
		this.pipesObject = [];

		// Расчет мин и макс старта для верхней трубы
		this.minTopPipeY = -this.pipeSize.height + 120;
		this.maxTopPipeY = 0;

		//Параметры птицы
		this.birdY = (this.canvas.height - this.birdSize.height) / 2;
		this.birdYTurnPoint = this.birdY;
		this.birdYDirection = 0;
		this.birdX = this.canvas.width / 2 - this.birdSize.width / 2 - 100;
		this.birdStep = this.pipeGap / 2 - this.birdSize.height / 1.5;

		//Летающий декор начальные координаты
		this.setNewPlaneSettings();

		this.gameOver = false;
		this.score = 0;
		this.target = 5;
		this.bestScore = localStorage.getItem("bestScore") || 0;
		this.setScoreInScoreBlock();

		this.pause = true;
		this.started = false;

		this.pipesXCoordinates = [
			{ x: this.canvas.width, y: 0 },
			{ x: this.canvas.width + 260, y: -200 },
		];
	};

	// функция для отрисовки кадра
	render = () => {
		this.animationTimeout = setTimeout(() => {
			this.animationId = window.requestAnimationFrame(this.render);

			//Индекс взмахов крыла
			this.flapIndex += 0.6;
			this.setBirdDirection();

			this.renderer = new Renderer(this);
			this.bird = new Bird(this);
			this.pipes = new Pipes(this, this.pipesXCoordinates);

			/*
				При нажатии стрелки вверх меняется
				направление движения птицы по оси Y
				И появляется точка разворота
				к падению.
				Здесь мы проверяем достигнута эта точка или нет
				Если да то птица начинает падать
			*/

			if (this.birdYTurnPoint <= this.birdY) {
				this.birdRising();
			} else {
				this.birdFalling();
			}

			/*
				Пока игра стартует рисуем
				Секунды до начала игры
			*/
			if (this.secondsToStart >= 0) {
				this.renderer.renderCounter(this.secondsToStart);
			}

			/*
				Когда секунды пройдут
				Начинаем двигать
				Облака, Трубы, Летающие объекты
			*/
			if (this.secondsToStart <= 0) {
				this.index += 0.3;
				this.backgroudX = -((this.index * this.cloudSpeed) % this.canvas.width);

				this.movePipes();
				this.movePlane();
			}

			//Проверяем столкновение с трубами или с землей
			this.pipes.pipesObject.forEach((pipeSettings) => {
				this.birdCrash(pipeSettings);
				if (this.secondsToStart <= 0) {
					this.addScore(pipeSettings.topPipe);
				}
			});
		}, Math.round(1000 / this.fps));
	};
}
