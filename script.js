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
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--current-accent').trim();
    ctx.strokeStyle = accent;
    ctx.lineWidth = 0.5;
    for (let x = 0; x < canvas.width; x += 50) {
        for (let y = 0; y < canvas.height; y += 50) {
            const dist = Math.hypot(x - mouse.x, y - mouse.y);
            ctx.globalAlpha = Math.max(0.1, 0.6 - dist / 300);
            ctx.strokeRect(x, y, 50, 50);
        }
    }
    requestAnimationFrame(drawGrid);
}
drawGrid();

document.addEventListener('mousemove', (e) => {
    if (window.innerWidth <= 768) return;
    mouse.x = e.clientX; mouse.y = e.clientY;
    cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
});

document.addEventListener('mousedown', (e) => {
    cursor.classList.add('pressed');
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = e.clientX + 'px';
    ripple.style.top = (e.clientY + window.scrollY) + 'px';
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
});
document.addEventListener('mouseup', () => cursor.classList.remove('pressed'));

const inputEl = document.getElementById('term-input');
const consoleEl = document.getElementById('term-console');

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
        const root = document.documentElement;
        
        if (cmd === 'red') {
            root.style.setProperty('--current-accent', '#ff0000');
            root.style.setProperty('--bg-glow', 'rgba(150, 0, 0, 0.2)');
            root.style.setProperty('--vignette-color', 'rgba(30, 0, 0, 0.9)');
            document.body.classList.add('red-mode');
            logoMain.style.filter = "drop-shadow(0 0 15px #ff0000)";
            document.getElementById('mode-text').innerText = "NIGHT_PROTOCOL";
        } 
        else if (cmd === 'aqua') {
            root.style.setProperty('--current-accent', '#00ffd8');
            root.style.setProperty('--bg-glow', 'rgba(0, 255, 216, 0.08)');
            root.style.setProperty('--vignette-color', 'rgba(0, 0, 0, 0.9)');
            document.body.classList.remove('red-mode');
            logoMain.style.filter = "drop-shadow(0 0 15px #00ffd8)";
            document.getElementById('mode-text').innerText = "AQUA_CORE";
        }
        inputEl.value = '';
    }
});

window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loading-screen').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('loading-screen').style.display = 'none';
            document.querySelectorAll('.type-output').forEach(el => {
                const text = el.getAttribute('data-text');
                let i = 0; el.innerText = '';
                const type = setInterval(() => {
                    el.innerText += text[i]; i++;
                    if (i >= text.length) clearInterval(type);
                }, 30);
            });
        }, 1000);
        document.getElementById('main-content').style.opacity = '1';
    }, 3000);
});
