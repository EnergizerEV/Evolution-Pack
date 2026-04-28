const cursor = document.getElementById('custom-cursor');
const canvas = document.getElementById('grid-canvas');
const ctx = canvas.getContext('2d');
const logoMain = document.getElementById('logo-main');
const logoErr = document.getElementById('logo-err');
const vignette = document.getElementById('vignette');
let mouse = { x: -1000, y: -1000 };

function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resize); resize();

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const size = 50;
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--current-accent').trim();
    ctx.lineWidth = 0.5;
    for (let x = 0; x < canvas.width; x += size) {
        for (let y = 0; y < canvas.height; y += size) {
            const dist = Math.hypot(x - mouse.x, y - mouse.y);
            const offset = Math.max(0, 10 - dist / 30);
            ctx.globalAlpha = offset > 0 ? 0.6 : 0.15;
            ctx.strokeRect(x - offset/2, y - offset/2, size + offset, size + offset);
        }
    }
    requestAnimationFrame(drawGrid);
}
drawGrid();

document.addEventListener('mousemove', (e) => {
    if (window.innerWidth <= 768) return;
    mouse.x = e.clientX; mouse.y = e.clientY;
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
    const xPct = (e.clientX / window.innerWidth) * 100;
    const yPct = (e.clientY / window.innerHeight) * 100;
    vignette.style.background = `radial-gradient(circle at ${xPct}% ${yPct}%, transparent 10%, rgba(0,0,0,0.95) 70%)`;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    document.querySelectorAll('.parallax-layer').forEach(layer => {
        const str = layer.getAttribute('data-strength');
        const isHovered = layer.classList.contains('card') && layer.matches(':hover');
        const transX = (e.clientX - centerX) / str;
        const transY = (e.clientY - centerY) / str;
        let scale = 1, rotateX = 0, rotateY = 0;
        if (isHovered) {
            scale = 1.03;
            const rect = layer.getBoundingClientRect();
            const cardCenterX = rect.left + rect.width / 2;
            const cardCenterY = rect.top + rect.height / 2;
            rotateY = (e.clientX - cardCenterX) / 25; 
            rotateX = (cardCenterY - e.clientY) / 25;
        }
        layer.style.transform = `translate3d(${transX}px, ${transY}px, 0) scale(${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
});

document.addEventListener('mousedown', (e) => {
    cursor.classList.add('pressed');
    const clickX = e.clientX;
    const clickY = e.clientY;
    const xPos = clickX;
    const yPos = clickY + (window.innerWidth <= 768 ? window.scrollY : 0);

    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = xPos + 'px';
    ripple.style.top = yPos + 'px';
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
});
document.addEventListener('mouseup', () => cursor.classList.remove('pressed'));

const consoleEl = document.getElementById('term-console');
const inputEl = document.getElementById('term-input');
const modeText = document.getElementById('mode-text');

window.addEventListener('keydown', (e) => {
    if (e.code === 'Backquote') {
        e.preventDefault();
        consoleEl.classList.toggle('active');
        if (consoleEl.classList.contains('active')) inputEl.focus();
    }
});

inputEl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const cmd = inputEl.value.toLowerCase().trim();
        if (cmd === 'red') {
            document.documentElement.style.setProperty('--current-accent', 'var(--blood-red)');
            document.documentElement.style.setProperty('--bg-glow', 'rgba(100, 0, 0, 0.3)'); // Сильное красное свечение в центре
            document.documentElement.style.setProperty('--vignette-color', 'rgba(20, 0, 0, 0.9)'); // Темно-красные края
            document.body.classList.add('red-mode');
            logoMain.style.backgroundImage = "url('Project_Night_Icon.png')";
            logoErr.style.backgroundImage = "url('Project_Night_Icon_ERR.png')";
            modeText.innerText = "NIGHT_PROTOCOL";
        } 
        else if (cmd === 'aqua') {
            document.documentElement.style.setProperty('--current-accent', 'var(--aqua)');
            document.documentElement.style.setProperty('--bg-glow', 'rgba(0, 255, 216, 0.1)');
            document.documentElement.style.setProperty('--vignette-color', 'rgba(0, 0, 0, 0.9)');
            document.body.classList.remove('red-mode');
            logoMain.style.backgroundImage = "url('EV_Dark_2k.png')";
            logoErr.style.backgroundImage = "url('EV_Dark_2k_ERR.png')";
            modeText.innerText = "AQUA_CORE";
        }
        if (cmd === 'clear') consoleEl.classList.remove('active');
        inputEl.value = '';
    }
});

const nick = document.getElementById('nickname');
const original = nick.innerText;
nick.onmouseover = () => {
    let i = 0;
    const iter = setInterval(() => {
        nick.innerText = original.split("").map((l, idx) => idx < i ? original[idx] : "X_#$@&"[Math.floor(Math.random()*6)]).join("");
        if (i >= original.length) clearInterval(iter);
        i += 1/3;
    }, 30);
};

function startTyping() {
    document.querySelectorAll('.type-output').forEach(el => {
        const text = el.getAttribute('data-text');
        let charIdx = 0;
        el.innerText = '';
        const type = setInterval(() => {
            el.innerText += text[charIdx];
            charIdx++;
            if (charIdx >= text.length) clearInterval(type);
        }, 30);
    });
}

window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loading-screen').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('loading-screen').style.display = 'none';
            startTyping();
        }, 1000);
        document.getElementById('main-content').style.opacity = '1';
    }, 3000);
    setInterval(() => { 
        const cpu = document.getElementById('cpu-val');
        if(cpu) cpu.innerText = Math.floor(Math.random()*15)+5; 
    }, 2000);
});
