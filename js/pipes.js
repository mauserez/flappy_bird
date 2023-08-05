class Pipes {
	constructor(game, xCoordinates) {
		this.game = game;
		this.size = game.pipeSize;
		this.pipesObject = [];

		xCoordinates.forEach((coordinates) => {
			const topPipe = {
				x: coordinates.x,
				y: coordinates.y,
				yEnd: coordinates.y + this.size.height,
				height: this.size.height,
				source: {
					x: 432,
					y: 110,
				},
			};

			const bottomPipeStart = topPipe.yEnd + this.game.pipeGap;
			const bottomPipeEnd = bottomPipeStart + this.size.height;
			const bottomPipe = {
				x: coordinates.x,
				y: bottomPipeStart,
				yEnd: bottomPipeEnd,
				height:
					this.game.canvas.height - bottomPipeStart - this.game.sandHeigth,
				source: {
					x: 510,
					y: 108,
				},
			};

			this.pipesObject.push({ topPipe: topPipe, bottomPipe: bottomPipe });

			this.drawPipe(topPipe);
			this.drawPipe(bottomPipe);
		});
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
			x: pipeData.x,
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
