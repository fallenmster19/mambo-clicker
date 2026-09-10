const mamboGif = document.getElementById('mamboGif');
const mamboCount = document.getElementById('mamboCount');
const mamboSound = new Audio('assets/audio/manbo.mp3');
const laughSound = new Audio('assets/audio/mambo-laugh-matikanetannhauser.mp3');
const prettyDerbySound = new Audio('assets/audio/matikanetannhauser-uma-musume-pretty-derby.mp3');
const wowSound = new Audio('assets/audio/wow-matikane-tannhauser.mp3');
const rareSounds = [laughSound, prettyDerbySound, wowSound];
const rareChance = 0.00001;
const STORAGE_KEY = 'mamboCount';
let count = 0;

try {
	const saved = localStorage.getItem(STORAGE_KEY);
	const parsed = Number.parseInt(saved, 10);
	if (Number.isFinite(parsed) && parsed >= 0) {
		count = parsed;
	}
} catch (_) {
	count = 0;
}
mamboCount.textContent = count;

function playSound(sound) {
	sound.currentTime = 0;
	sound.play().catch(() => {});
}

function clickMambo() {
	count += 1;
	mamboCount.textContent = count;
	try {
		localStorage.setItem(STORAGE_KEY, String(count));
	} catch (_) {}
	playSound(mamboSound);

	if (Math.random() < rareChance) {
		playSound(rareSounds[Math.floor(Math.random() * rareSounds.length)]);
	}
}

mamboGif.addEventListener('click', clickMambo);
mamboGif.addEventListener('keydown', (event) => {
	if (event.key === 'Enter' || event.key === ' ') {
		event.preventDefault();
		clickMambo();
	}
});
