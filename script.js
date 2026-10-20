const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const sky = document.querySelector(".night-sky");
const skyContext = sky.getContext("2d");
let skyWidth = 0;
let skyHeight = 0;
let stars = [];

function resizeSky() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  skyWidth = window.innerWidth;
  skyHeight = window.innerHeight;
  sky.width = Math.floor(skyWidth * ratio);
  sky.height = Math.floor(skyHeight * ratio);
  skyContext.setTransform(ratio, 0, 0, ratio, 0, 0);
  const count = Math.min(105, Math.floor((skyWidth * skyHeight) / 9500));
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * skyWidth,
    y: Math.random() * skyHeight,
    radius: Math.random() * 1.15 + 0.25,
    phase: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.012 + 0.003,
  }));
}

function paintSky(time = 0) {
  skyContext.clearRect(0, 0, skyWidth, skyHeight);
  for (const star of stars) {
    const shimmer = reducedMotion ? 0.72 : 0.38 + (Math.sin(time * star.speed + star.phase) + 1) * 0.28;
    skyContext.beginPath();
    skyContext.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    skyContext.fillStyle = `rgba(255, 210, 222, ${shimmer})`;
    skyContext.fill();
  }
  if (!reducedMotion) {
    window.requestAnimationFrame(paintSky);
  }
}

resizeSky();
paintSky();
window.addEventListener("resize", resizeSky, { passive: true });

const heartSvg = document.querySelector(".heart-svg");
const heartNamespace = "http://www.w3.org/2000/svg";
const heartLayers = 30;
const heartPoints = 180;

for (let layer = 1; layer <= heartLayers; layer += 1) {
  const growth = 0.2 + (layer / heartLayers) * 0.8;
  const path = document.createElementNS(heartNamespace, "path");
  const coordinates = [];

  for (let point = 0; point <= heartPoints; point += 1) {
    const t = (Math.PI * 2 * point) / heartPoints;
    const heartX = 16 * Math.sin(t) ** 3;
    const heartY = 13 * Math.cos(t)
      - 5 * Math.cos(2 * t)
      - 2 * Math.cos(3 * t)
      - Math.cos(4 * t);
    const x = 260 + heartX * 7.3 * growth;
    const y = 217 - heartY * 7.3 * growth;
    coordinates.push(`${point === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
  }

  path.setAttribute("d", `${coordinates.join(" ")} Z`);
  path.setAttribute("class", "heart-layer");
  const pathLength = path.getTotalLength();
  const color = Math.round(130 + (layer / heartLayers) * 100);
  const opacity = 0.12 + (layer / heartLayers) * 0.42;
  path.style.setProperty("--path-length", pathLength);
  path.style.setProperty("--draw-delay", `${(layer - 1) * 55}ms`);
  path.style.setProperty("--layer-opacity", opacity);
  path.style.setProperty("--heart-color", `rgb(${color}, ${Math.round(color * 0.14)}, ${Math.round(color * 0.28)})`);
  path.style.strokeDasharray = pathLength;
  path.style.strokeDashoffset = pathLength;
  if (reducedMotion) {
    path.style.opacity = opacity;
    path.style.strokeDashoffset = 0;
  }
  heartSvg.append(path);
}

const scenes = document.querySelectorAll(".scene");
const visibilityObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
    }
  }
}, { threshold: 0.2 });

scenes.forEach((scene) => visibilityObserver.observe(scene));

document.querySelectorAll("[data-scroll]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.getElementById(button.dataset.scroll);
    target?.scrollIntoView({ behavior: reducedMotion ? "instant" : "smooth" });
  });
});

const foreverScene = document.querySelector(".forever-scene");
const foreverLetters = document.querySelector(".forever-letters");
const foreverHeart = document.querySelector(".forever-heart-outline");
const foreverHeartClip = document.querySelector(".forever-heart-clip-shape");
const foreverEnding = document.querySelector(".forever-ending");
const replayButton = document.querySelector(".replay-button");
let foreverStarted = false;

const lovePhrases = [
  { language: "İngilizce", phrase: "I love you" },
  { language: "İspanyolca", phrase: "Te quiero" },
  { language: "Fransızca", phrase: "Je t'aime" },
  { language: "İtalyanca", phrase: "Ti amo" },
  { language: "Portekizce", phrase: "Eu te amo" },
  { language: "Almanca", phrase: "Ich liebe dich" },
  { language: "Felemenkçe", phrase: "Ik hou van jou" },
  { language: "İsveççe", phrase: "Jag älskar dig" },
  { language: "Norveççe", phrase: "Jeg elsker deg" },
  { language: "Danca", phrase: "Jeg elsker dig" },
  { language: "Fince", phrase: "Rakastan sinua" },
  { language: "İzlandaca", phrase: "Ég elska þig" },
  { language: "Lehçe", phrase: "Kocham cię" },
  { language: "Çekçe", phrase: "Miluji tě" },
  { language: "Slovakça", phrase: "Ľúbim ťa" },
  { language: "Macarca", phrase: "Szeretlek" },
  { language: "Romence", phrase: "Te iubesc" },
  { language: "Yunanca (Latin harfleriyle)", phrase: "S'agapo" },
  { language: "Hırvatça", phrase: "Volim te" },
  { language: "Sırpça (Latin harfleriyle)", phrase: "Volim te" },
  { language: "Arnavutça", phrase: "Të dua" },
  { language: "Litvanca", phrase: "Aš tave myliu" },
  { language: "Letonca", phrase: "Es tevi mīlu" },
  { language: "Estonca", phrase: "Ma armastan sind" },
  { language: "Katalanca", phrase: "T'estimo" },
  { language: "Baskça", phrase: "Maite zaitut" },
  { language: "Galiçyaca", phrase: "Quérote" },
  { language: "Afrikaanca", phrase: "Ek is lief vir jou" },
  { language: "Svahili", phrase: "Nakupenda" },
  { language: "Endonezce", phrase: "Aku cinta kamu" },
  { language: "Malayca", phrase: "Saya cinta padamu" },
  { language: "Filipince", phrase: "Mahal kita" },
  { language: "Vietnamca", phrase: "Anh yêu em" },
  { language: "Çince (Pinyin)", phrase: "Wǒ ài nǐ" },
  { language: "Japonca (Romaji)", phrase: "Aishiteru" },
  { language: "Korece (Latin harfleriyle)", phrase: "Saranghae" },
  { language: "Rusça (Latin harfleriyle)", phrase: "Ya tebya lyublyu" },
  { language: "Ukraynaca (Latin harfleriyle)", phrase: "Ya tebe kokhayu" },
  { language: "Hintçe (Latin harfleriyle)", phrase: "Main tumse pyaar karta hoon" },
  { language: "Bengalce (Latin harfleriyle)", phrase: "Ami tomake bhalobashi" },
  { language: "Ermenice (Latin harfleriyle)", phrase: "Yes kez sirum em" },
  { language: "Gürcüce (Latin harfleriyle)", phrase: "Me shen mikvarkhar" },
  { language: "Māori", phrase: "Aroha ahau ki a koe" },
  { language: "Hawaiice", phrase: "Aloha au iā ʻoe" },
  { language: "Arapça (Latin harfleriyle)", phrase: "Uḥibbuki" },
  { language: "Farsça (Latin harfleriyle)", phrase: "Dooset daram" },
  { language: "Urduca (Latin harfleriyle)", phrase: "Main tum se mohabbat karta hoon" },
  { language: "Türkçe", phrase: "Seni seviyorum" },
];

function revealForever() {
  if (foreverStarted) {
    return;
  }
  foreverStarted = true;
  const rowCount = lovePhrases.length / 2;
  const centerIndex = Math.floor(rowCount / 2);
  const centerY = 170 + (570 * centerIndex) / (rowCount - 1);
  const rows = Array.from({ length: rowCount }, (_, index) => ({
    index,
    y: index < centerIndex
      ? 170 + ((centerY - 50 - 170) * index) / (centerIndex - 1)
      : index > centerIndex
        ? centerY + 50 + ((740 - centerY - 50) * (index - centerIndex - 1)) / (rowCount - centerIndex - 2)
        : centerY,
  }));
  const phraseOrder = lovePhrases
    .filter(({ language }) => language !== "Türkçe")
    .sort((first, second) => second.phrase.length - first.phrase.length);
  const centerPhrase = phraseOrder.shift();

  const heartPoints = [];
  for (let point = 0; point <= 240; point += 1) {
    const t = (Math.PI * 2 * point) / 240;
    const heartX = 16 * Math.sin(t) ** 3;
    const heartY = 13 * Math.cos(t)
      - 5 * Math.cos(2 * t)
      - 2 * Math.cos(3 * t)
      - Math.cos(4 * t);
    heartPoints.push({
      x: 300 + heartX * 15.3,
      y: 432 - heartY * 23.5,
    });
  }
  const heartPath = heartPoints
    .map(({ x, y }, index) => `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ") + " Z";
  foreverHeart.setAttribute("d", heartPath);
  foreverHeartClip.setAttribute("d", heartPath);
  const outlineLength = foreverHeart.getTotalLength();
  foreverHeart.style.setProperty("--outline-length", outlineLength);
  foreverHeart.style.strokeDasharray = outlineLength;
  foreverHeart.style.strokeDashoffset = reducedMotion ? 0 : outlineLength;

  const spansAtY = (y) => {
    const crossings = [];
    for (let index = 0; index < heartPoints.length; index += 1) {
      const first = heartPoints[index];
      const second = heartPoints[(index + 1) % heartPoints.length];
      if ((first.y <= y && second.y > y) || (second.y <= y && first.y > y)) {
        crossings.push(first.x + ((y - first.y) * (second.x - first.x)) / (second.y - first.y));
      }
    }
    crossings.sort((first, second) => first - second);
    if (crossings.length >= 4) {
      return [
        [crossings[0], crossings[1]],
        [crossings[crossings.length - 2], crossings[crossings.length - 1]],
      ];
    }
    if (crossings.length >= 2) {
      const left = crossings[0];
      const right = crossings[crossings.length - 1];
      const middle = (left + right) / 2;
      return [[left, middle], [middle, right]];
    }
    return [];
  };

  const rowsByWidth = rows
    .filter(({ index }) => index !== centerIndex)
    .map((row) => ({ ...row, spans: spansAtY(row.y) }))
    .sort((first, second) => {
      const firstWidth = first.spans.reduce((total, [left, right]) => total + right - left, 0);
      const secondWidth = second.spans.reduce((total, [left, right]) => total + right - left, 0);
      return secondWidth - firstWidth;
    });
  const phrasePairs = [];
  while (phraseOrder.length > 0) {
    phrasePairs.push(phraseOrder.splice(0, 2));
  }
  phrasePairs.forEach((pair, index) => {
    rowsByWidth[index].pair = pair;
  });

  const addPhrase = (language, phrase, x, y, slotWidth, index, highlighted = false) => {
    const line = document.createElementNS(heartNamespace, "text");
    line.setAttribute("x", x.toFixed(1));
    line.setAttribute("y", y.toFixed(1));
    line.setAttribute("text-anchor", "middle");
    line.setAttribute("font-size", highlighted ? "27" : "20");
    line.setAttribute("aria-label", `${language}: ${phrase}`);
    line.classList.add("love-phrase");
    if (highlighted) {
      line.classList.add("turkish-phrase");
    }
    const title = document.createElementNS(heartNamespace, "title");
    title.textContent = `${language}: ${phrase}`;
    line.append(title, document.createTextNode(phrase));
    foreverLetters.append(line);
    const naturalWidth = line.getComputedTextLength();
    const fontSize = highlighted
      ? Math.min(27, (slotWidth * 0.88 * 27) / naturalWidth)
      : Math.min(20, Math.max(12, (slotWidth * 0.9 * 20) / naturalWidth));
    line.setAttribute("font-size", fontSize.toFixed(1));
    if (naturalWidth * (fontSize / (highlighted ? 27 : 20)) > slotWidth * 0.9) {
      line.setAttribute("textLength", (slotWidth * 0.88).toFixed(1));
      line.setAttribute("lengthAdjust", "spacingAndGlyphs");
    }
    if (reducedMotion) {
      line.classList.add("is-lit");
    } else {
      window.setTimeout(() => line.classList.add("is-lit"), 90 + index * 42);
    }
  };

  rowsByWidth.forEach(({ pair, spans, y, index }) => {
    if (!pair || spans.length !== 2) {
      return;
    }
    pair.forEach(({ language, phrase }, columnIndex) => {
      const [left, right] = spans[columnIndex];
      addPhrase(language, phrase, (left + right) / 2, y, right - left - 10, index * 2 + columnIndex);
    });
  });
  const centerRow = rows[centerIndex];
  const centerSpans = spansAtY(centerRow.y);
  const centerWidth = centerSpans.at(-1)[1] - centerSpans[0][0] - 20;
  addPhrase(centerPhrase.language, centerPhrase.phrase, 300, centerRow.y - 22, centerWidth, centerIndex * 2);
  addPhrase("Türkçe", "Seni seviyorum", 300, centerRow.y + 22, centerWidth, centerIndex * 2 + 1, true);

  if (reducedMotion) {
    foreverHeart.classList.add("is-drawn");
    foreverEnding.classList.add("is-visible");
    replayButton.classList.add("is-visible");
    return;
  }

  foreverHeart.style.animationDelay = "0ms";
  foreverHeart.classList.add("is-drawn");
  const finishDelay = 90 + lovePhrases.length * 42 + 450;
  window.setTimeout(() => foreverEnding.classList.add("is-visible"), finishDelay);
  window.setTimeout(() => replayButton.classList.add("is-visible"), finishDelay + 500);
}

const foreverObserver = new IntersectionObserver((entries) => {
  if (entries.some((entry) => entry.isIntersecting)) {
    revealForever();
    foreverObserver.disconnect();
  }
}, { threshold: 0.35 });

foreverObserver.observe(foreverScene);

replayButton.addEventListener("click", () => {
  foreverStarted = false;
  foreverLetters.replaceChildren();
  foreverHeart.classList.remove("is-drawn");
  foreverHeart.style.animation = "none";
  void foreverHeart.getBoundingClientRect();
  foreverHeart.style.animation = "";
  foreverEnding.classList.remove("is-visible");
  replayButton.classList.remove("is-visible");
  revealForever();
  foreverScene.scrollIntoView({ behavior: reducedMotion ? "instant" : "smooth" });
});
