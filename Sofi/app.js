// ====== PERSONALIZA AQUÍ ======
const CONFIG = {
  herName: "Sofía",               // <-- cámbialo
  yourName: "Carlos",             // <-- cámbialo
  sinceDate: "2023-11-24",        // <-- fecha desde la que cuentan (YYYY-MM-DD)
  valentineDateLabel: "14 de febrero",

  heroTypewriterLines: [
    "Hice esto con mucho amor para ti…",
    "Porque contigo la vida se siente más bonita ✨",
    "Y hoy quiero preguntarte algo importante 💌"
  ],

  photos: [
    { src: "assets/fotos/01.jpg", caption: "Gracias por regalarme 5 minutitos 💖" },
    { src: "assets/fotos/02.jpg", caption: "Mi lugar favorito: contigo." },
    { src: "assets/fotos/03.jpg", caption: "Tus ojos + mi calma = perfecto." },
    { src: "assets/fotos/04.jpg", caption: "Gracias por existir en mi vida ✨" }
  ],

  memories: [
    { k: "Lo que más amo de ti", v: "Tu forma de amar y tu mirada." },
    { k: "Mi plan favorito", v: "Cualquier cosa, si es contigo." },
    { k: "Mi promesa", v: "Cuidarte, escucharte y elegirte siempre." },
  ],

  timeline: [
    { date: "Un día cualquiera", title: "Nos encontramos", desc: "Y desde ahí, todo empezó a brillar diferente." },
    { date: "Nuestros días", title: "Fuimos construyendo", desc: "Risas, planes, abrazos, peleas, … y una vida juntos." },
    { date: "Hoy", title: "Te tengo una pregunta", desc: "De esas que se hacen con el corazón." }
  ],

  modal: {
    yesTitle: "¡Siiiii! 💖",
    yesText: "¡Me acabas de hacer la persona más feliz del mundo! Prometo que cada día a mi lado se sienta como un regalo. ✨",
    maybeTitle: "Te amo✨",
    maybeText: "No hay nadie más con quien quisiera pasar este día (y todos los demás). Eres mi lugar favorito. 💘",
  }
};
// ==============================


// Elements
const herNameTop = document.getElementById("herNameTop");
const herName = document.getElementById("herName");
const herNameAsk = document.getElementById("herNameAsk");
const yourNameFoot = document.getElementById("yourNameFoot");
const heroPhoto = document.getElementById("heroPhoto");
const sinceEl = document.getElementById("since");
const counterEl = document.getElementById("counter");
const valDay = document.getElementById("valDay");
const typewriterEl = document.getElementById("typewriter");

const track = document.getElementById("track");
const dots = document.getElementById("dots");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const memoriesEl = document.getElementById("memories");
const timelineEl = document.getElementById("timeline");

const yesBtn = document.getElementById("yesBtn");
const maybeBtn = document.getElementById("maybeBtn");
const noBtn = document.getElementById("noBtn");

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");
const closeModal = document.getElementById("closeModal");

// Music
const musicBtn = document.getElementById("musicBtn");
const bgMusic = document.getElementById("bgMusic");
const musicIcon = document.getElementById("musicIcon");
const musicLabel = document.getElementById("musicLabel");
let musicOn = false;

// Confetti
const confettiCanvas = document.getElementById("confetti");
const ctx = confettiCanvas.getContext("2d");

// Init
applyConfig();
buildCarousel();
buildMemories();
buildTimeline();
startTypewriter();
setupButtons();
setupMusic();
setupPWA();
updateCounter();
setInterval(updateCounter, 30_000);

// ====== Functions ======
function applyConfig(){
  herNameTop.textContent = CONFIG.herName;
  herName.textContent = CONFIG.herName;
  herNameAsk.textContent = CONFIG.herName;
  yourNameFoot.textContent = CONFIG.yourName;

  valDay.textContent = CONFIG.valentineDateLabel;

  // hero photo
  heroPhoto.src = CONFIG.photos[0]?.src || "";
  heroPhoto.alt = "Foto de " + CONFIG.yourName + " y " + CONFIG.herName;

  // Since date label
  const d = new Date(CONFIG.sinceDate + "T00:00:00");
  sinceEl.textContent = formatLongDate(d);
}

function updateCounter(){
  const start = new Date(CONFIG.sinceDate + "T00:00:00");
  const now = new Date();
  const diffMs = now - start;
  const days = Math.max(0, Math.floor(diffMs / (1000*60*60*24)));
  counterEl.textContent = days.toString();
}

function formatLongDate(date){
  const opts = { year:"numeric", month:"long", day:"numeric" };
  return date.toLocaleDateString("es-CO", opts);
}

function buildCarousel(){
  track.innerHTML = "";
  dots.innerHTML = "";

  CONFIG.photos.forEach((p, idx) => {
    const slide = document.createElement("div");
    slide.className = "slide";
    slide.innerHTML = `
      <img src="${p.src}" alt="Foto ${idx+1}">
      <div class="caption">${escapeHtml(p.caption || "")}</div>
    `;
    track.appendChild(slide);

    const dot = document.createElement("div");
    dot.className = "dot" + (idx===0 ? " active" : "");
    dot.addEventListener("click", () => goTo(idx));
    dots.appendChild(dot);
  });

  let index = 0;
  const max = CONFIG.photos.length - 1;

  function updateDots(){
    [...dots.children].forEach((d, i) => d.classList.toggle("active", i === index));
  }

  function goTo(i){
    index = Math.max(0, Math.min(max, i));
    const slideWidth = track.clientWidth;
    track.scrollTo({ left: slideWidth * index, behavior: "smooth" });
    updateDots();

    // swap hero photo sometimes
    if (CONFIG.photos[index]?.src) heroPhoto.src = CONFIG.photos[index].src;
  }

  prevBtn.addEventListener("click", () => goTo(index - 1));
  nextBtn.addEventListener("click", () => goTo(index + 1));

  // Swipe support
  let startX = 0, isDown = false;

  track.addEventListener("pointerdown", (e) => {
    isDown = true;
    startX = e.clientX;
    track.setPointerCapture(e.pointerId);
  });

  track.addEventListener("pointerup", (e) => {
    if (!isDown) return;
    const dx = e.clientX - startX;
    isDown = false;

    if (Math.abs(dx) > 40){
      if (dx < 0) goTo(index + 1);
      else goTo(index - 1);
    }
  });

  // keep index in sync on resize
  window.addEventListener("resize", () => goTo(index));
}

function buildMemories(){
  memoriesEl.innerHTML = "";
  CONFIG.memories.forEach(m => {
    const el = document.createElement("div");
    el.className = "mem";
    el.innerHTML = `<div class="mem__k">${escapeHtml(m.k)}</div><div class="mem__v">${escapeHtml(m.v)}</div>`;
    memoriesEl.appendChild(el);
  });
}

function buildTimeline(){
  timelineEl.innerHTML = "";
  CONFIG.timeline.forEach(t => {
    const li = document.createElement("li");
    li.className = "tl";
    li.innerHTML = `
      <div class="tl__date">${escapeHtml(t.date)}</div>
      <div>
        <div class="tl__title">${escapeHtml(t.title)}</div>
        <div class="tl__desc">${escapeHtml(t.desc)}</div>
      </div>
    `;
    timelineEl.appendChild(li);
  });
}

function startTypewriter(){
  const lines = CONFIG.heroTypewriterLines;
  let lineIdx = 0, charIdx = 0;
  typewriterEl.textContent = "";

  const tick = () => {
    const current = lines[lineIdx] || "";
    typewriterEl.textContent = current.slice(0, charIdx);

    if (charIdx < current.length){
      charIdx++;
      setTimeout(tick, 26 + Math.random()*18);
    } else {
      // pause, next line
      setTimeout(() => {
        lineIdx = (lineIdx + 1) % lines.length;
        charIdx = 0;
        typewriterEl.textContent = "";
        tick();
      }, 1100);
    }
  };

  tick();
}

function setupButtons(){
  yesBtn.addEventListener("click", () => {
    openModal(CONFIG.modal.yesTitle, CONFIG.modal.yesText);
    burstConfetti();
    pulseHearts();
  });

  maybeBtn.addEventListener("click", () => {
    openModal(CONFIG.modal.maybeTitle, CONFIG.modal.maybeText);
    burstConfetti();
    pulseHearts();
  });

  // Fun "No" button that dodges
  noBtn.addEventListener("pointerenter", dodgeNo);
  noBtn.addEventListener("click", dodgeNo);

  closeModal.addEventListener("click", closeTheModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeTheModal();
  });

  function dodgeNo(){
    const parent = noBtn.parentElement;
    const rect = parent.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();

    const maxX = rect.width - btnRect.width;
    const maxY = 80; // keep it near buttons row

    const x = Math.max(0, Math.min(maxX, Math.random() * maxX));
    const y = (Math.random() * maxY) - 20;

    noBtn.style.transform = `translate(${x}px, ${y}px)`;
  }
}

function openModal(title, text){
  modalTitle.textContent = title;
  modalText.textContent = text;
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}

function closeTheModal(){
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

function setupMusic(){
  async function startMusic(){
    try{
      await bgMusic.play();
      musicOn = true;
      musicIcon.textContent = "❚❚";
      musicLabel.textContent = "Pausar";
    } catch (e){
      // Autoplay bloqueado: queda listo para el primer toque
      musicOn = false;
      musicIcon.textContent = "♫";
      musicLabel.textContent = "Activar";
    }
  }

  // 1) Intento de autoplay al cargar
  window.addEventListener("load", startMusic, { once: true });

  // 2) Si lo bloquean, primer toque en cualquier parte lo activa
  document.addEventListener("click", () => {
    if (!musicOn) startMusic();
  }, { once: true });

  // 3) Botón manual (siempre funciona)
  musicBtn.addEventListener("click", async () => {
    try{
      if (!musicOn){
        await bgMusic.play();
        musicOn = true;
        musicIcon.textContent = "❚❚";
        musicLabel.textContent = "Pausar";
      } else {
        bgMusic.pause();
        musicOn = false;
        musicIcon.textContent = "♫";
        musicLabel.textContent = "Música";
      }
    } catch (e){
      openModal("Ups 🙈", "No pude reproducir la música. Revisa que exista assets/music.mp3 y que el navegador permita audio.");
    }
  });
}


function setupPWA(){
  if ("serviceWorker" in navigator){
    navigator.serviceWorker.register("./service-worker.js").catch(()=>{});
  }
}

// ===== Confetti (simple + bonito) =====
function resizeCanvas(){
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  confettiCanvas.width = Math.floor(window.innerWidth * dpr);
  confettiCanvas.height = Math.floor(window.innerHeight * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let confettiPieces = [];
let animId = null;

function burstConfetti(){
  const W = window.innerWidth, H = window.innerHeight;

  confettiPieces = [];
  const count = 180;

  for (let i=0;i<count;i++){
    confettiPieces.push({
      x: W/2 + (Math.random()*80-40),
      y: H/3 + (Math.random()*40-20),
      vx: (Math.random()*6-3),
      vy: (Math.random()*-6-2),
      g: 0.12 + Math.random()*0.08,
      r: 2 + Math.random()*4,
      a: 1,
      spin: (Math.random()*0.3-0.15),
      t: Math.random()*Math.PI*2,
      kind: Math.random() < 0.18 ? "heart" : "dot"
    });
  }

  if (animId) cancelAnimationFrame(animId);
  animateConfetti();
  setTimeout(() => { confettiPieces = []; }, 2200);
}

function animateConfetti(){
  ctx.clearRect(0,0,window.innerWidth, window.innerHeight);

  confettiPieces.forEach(p => {
    p.vy += p.g;
    p.x += p.vx;
    p.y += p.vy;
    p.t += p.spin;
    p.a *= 0.992;

    const alpha = Math.max(0, Math.min(1, p.a));
    ctx.globalAlpha = alpha;

    // soft gradient by alternating
    const grad = ctx.createLinearGradient(p.x-10,p.y-10,p.x+10,p.y+10);
    grad.addColorStop(0, "rgba(255,77,125,0.95)");
    grad.addColorStop(1, "rgba(167,139,250,0.9)");
    ctx.fillStyle = grad;

    if (p.kind === "heart") drawHeart(p.x, p.y, p.r*2.1, p.t);
    else {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fill();
    }
  });

  ctx.globalAlpha = 1;

  confettiPieces = confettiPieces.filter(p => p.y < window.innerHeight + 40 && p.a > 0.06);

  if (confettiPieces.length > 0){
    animId = requestAnimationFrame(animateConfetti);
  } else {
    ctx.clearRect(0,0,window.innerWidth, window.innerHeight);
  }
}

function drawHeart(x,y,size,rot){
  ctx.save();
  ctx.translate(x,y);
  ctx.rotate(rot);
  ctx.beginPath();
  const s = size;
  ctx.moveTo(0, s*0.35);
  ctx.bezierCurveTo(s*0.8, -s*0.1, s*0.55, -s*0.9, 0, -s*0.55);
  ctx.bezierCurveTo(-s*0.55, -s*0.9, -s*0.8, -s*0.1, 0, s*0.35);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function pulseHearts(){
  // Small micro animation: shake the ask card
  const ask = document.getElementById("pregunta");
  ask.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(1.01)" },
      { transform: "scale(1)" }
    ],
    { duration: 520, easing: "cubic-bezier(.2,.8,.2,1)" }
  );
}

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, (m) => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[m]));
}