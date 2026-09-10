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
const BONUS_LIFESPAN = 10;
const BONUS_SRC = 'assets/uma-musume-mambo.gif';
const EXPLOSION_SRC = 'assets/explosion-deltarune.gif';
// explosion-deltarune.gif tem 17 frames de 100ms = 1700ms totais
const EXPLOSION_DURATION_MS = 1700;
let bonusActive = false;

function playSound(sound) {
	sound.currentTime = 0;
	sound.play().catch(() => {});
}

function playRandomRareSound() {
	playSound(rareSounds[Math.floor(Math.random() * rareSounds.length)]);
}

function addToCount(amount) {
	count += amount;
	mamboCount.textContent = count;
	try {
		localStorage.setItem(STORAGE_KEY, String(count));
	} catch (_) {}
	return count;
}

function removeBonusMambo() {
	document.querySelector('.bonus-mambo')?.remove();
	bonusActive = false;
}

function explodeBonusMambo(wrap, explosionImg) {
	wrap.style.pointerEvents = 'none';
	explosionImg.style.display = 'block';
	// Reinicia o gif da explosão caso o browser tenha feito cache do frame final
	explosionImg.src = EXPLOSION_SRC + '?t=' + Date.now();
	setTimeout(removeBonusMambo, EXPLOSION_DURATION_MS);
}

function spawnBonusMambo() {
	if (bonusActive) {
		removeBonusMambo();
	}

	const wrap = document.createElement('div');
	wrap.className = 'bonus-mambo';
	wrap.setAttribute('role', 'button');
	wrap.setAttribute('tabindex', '0');
	wrap.setAttribute('aria-label', 'Bonus Mambo');

	// Canto aleatório com um pequeno jitter para não ficar sempre no mesmo pixel
	const margin = 16 + Math.floor(Math.random() * 72);
	const corner = Math.floor(Math.random() * 4);
	if (corner === 0) {
		wrap.style.top = margin + 'px';
		wrap.style.left = margin + 'px';
	} else if (corner === 1) {
		wrap.style.top = margin + 'px';
		wrap.style.right = margin + 'px';
	} else if (corner === 2) {
		wrap.style.bottom = margin + 'px';
		wrap.style.left = margin + 'px';
	} else {
		wrap.style.bottom = margin + 'px';
		wrap.style.right = margin + 'px';
	}

	const img = document.createElement('img');
	img.src = BONUS_SRC;
	img.alt = 'Bonus Mambo';
	img.className = 'mambo-img';
	img.width = 120;
	img.height = 120;

	const explosionImg = document.createElement('img');
	explosionImg.src = EXPLOSION_SRC;
	explosionImg.alt = '';
	explosionImg.className = 'explosion-img';
	explosionImg.setAttribute('aria-hidden', 'true');

	wrap.append(img, explosionImg);
	document.body.append(wrap);
	bonusActive = true;

	let remaining = BONUS_LIFESPAN;
	let exploded = false;

	function onBonusClick() {
		if (exploded) {
			return;
		}
		// Click no bônus conta no total, mas não dispara outro bônus
		// (evita spawn em cadeia quando o bônus cruza um múltiplo de 100).
		addToCount(1);
		playRandomRareSound();
		remaining -= 1;
		if (remaining <= 0) {
			exploded = true;
			explodeBonusMambo(wrap, explosionImg);
		}
	}

	wrap.addEventListener('click', onBonusClick);
	wrap.addEventListener('keydown', (event) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			onBonusClick();
		}
	});
}

function clickMambo() {
	const next = addToCount(1);
	playSound(mamboSound);

	if (Math.random() < rareChance) {
		playRandomRareSound();
	}

	if (next > 0 && next % 100 === 0) {
		spawnBonusMambo();
	}
}

mamboGif.addEventListener('click', clickMambo);
mamboGif.addEventListener('keydown', (event) => {
	if (event.key === 'Enter' || event.key === ' ') {
		event.preventDefault();
		clickMambo();
	}
});
