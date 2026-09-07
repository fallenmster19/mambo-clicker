const mamboGif = document.getElementById('mamboGif');
const mamboCount = document.getElementById('mamboCount');
const mamboSound = new Audio('assets/audio/manbo.mp3');
const laughSound = new Audio('assets/audio/mambo-laugh-matikanetannhauser.mp3');
const laughChance = 0.01;

function playSound(sound) {
	sound.currentTime = 0;
	sound.play().catch(() => {});
}

function clickMambo() {
	mamboCount.textContent = Number(mamboCount.textContent) + 1;
	playSound(mamboSound);

	if (Math.random() < laughChance) {
		playSound(laughSound);
	}
}

mamboGif.addEventListener('click', clickMambo);
mamboGif.addEventListener('keydown', (event) => {
	if (event.key === 'Enter' || event.key === ' ') {
		event.preventDefault();
		clickMambo();
	}
});
