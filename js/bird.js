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

	/*
		Рисуем птицу
		В зависимости от направления движения и состояния
	*/
	drawBird() {
		const birdImg =
			this.game.birdImages[this.game.birdYDirection][
				Math.floor((this.game.flapIndex % 9) / 3)
			];

		this.game.ctx.drawImage(
			birdImg,
			this.x,
			this.y,
			this.size.width,
			this.size.height
		);
	}
}
