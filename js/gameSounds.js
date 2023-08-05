class GameSounds {
	constructor() {
		const sounds = {
			flap: "sfx_wing.wav",
			score: "sfx_point.wav",
			crash: "sfx_hit.wav",
			gameOver: "sfx_gameover.wav",
			game: "sfx_game.wav",
		};

		for (const sound in sounds) {
			if (Object.hasOwnProperty.call(sounds, sound)) {
				this[sound] = this.createSound(`/sounds/${sounds[sound]}`, `${sound}`);
			}
		}
	}

	createSound(src, id) {
		const sound = document.createElement("audio");

		sound.src = src;
		sound.setAttribute("id", id);
		sound.setAttribute("preload", "auto");
		sound.setAttribute("controls", "none");

		sound.style.display = "none";

		if (id === "game") {
			sound.setAttribute("loop", "true");
		}

		sound.playSound = () => {
			sound.stop();
			sound.play();
		};

		sound.stop = () => {
			sound.pause();
			sound.currentTime = 0;
		};

		document.body.appendChild(sound);

		return sound;
	}
}
