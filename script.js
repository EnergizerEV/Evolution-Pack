const cursor = document.getElementById('custom-cursor');
const canvas = document.getElementById('grid-canvas');
const ctx = canvas.getContext('2d');
const logoMain = document.getElementById('logo-main');
const consoleEl = document.getElementById('term-console');
const inputEl = document.getElementById('term-input');
const modeText = document.getElementById('mode-text');
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
    document.documentElement.style.setProperty('--mouse-x', `${xPct}%`);
    document.documentElement.style.setProperty('--mouse-y', `${yPct}%`);
    
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    document.querySelectorAll('.parallax-layer').forEach(layer => {
        const str = layer.getAttribute('data-strength');
        const transX = (e.clientX - centerX) / str;
        const transY = (e.clientY - centerY) / str;

        if (layer.classList.contains('card')) {
            const rect = layer.getBoundingClientRect();
            if (e.clientX > rect.left && e.clientX < rect.right && e.clientY > rect.top && e.clientY < rect.bottom) {
                const rotateY = (e.clientX - (rect.left + rect.width / 2)) / 25; 
                const rotateX = ((rect.top + rect.height / 2) - e.clientY) / 25;
                layer.style.transform = `translate3d(${transX}px, ${transY}px, 0) scale(1.03) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            } else {
                layer.style.transform = `translate3d(${transX}px, ${transY}px, 0) scale(1) rotateX(0deg) rotateY(0deg)`;
            }
        } else {
            layer.style.transform = `translate3d(${transX}px, ${transY}px, 0)`;
        }
    });
});

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
            document.documentElement.style.setProperty('--current-accent', '#ff0000');
            document.body.style.backgroundColor = "#0a0000";
            document.body.classList.add('red-mode');
            logoMain.style.backgroundImage = "url('Project_Night_Icon.png')";
            modeText.innerText = "NIGHT_PROTOCOL";
        } else if (cmd === 'aqua') {
            document.documentElement.style.setProperty('--current-accent', '#00ffd8');
            document.body.style.backgroundColor = "#06080a";
            document.body.classList.remove('red-mode');
            logoMain.style.backgroundImage = "url('EV_Dark_2k.png')";
            modeText.innerText = "AQUA_CORE";
        }
        inputEl.value = '';
        consoleEl.classList.remove('active');
    }
});

document.addEventListener('mousedown', (e) => {
    cursor.classList.add('pressed');
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = e.clientX + 'px';
    ripple.style.top = e.clientY + 'px';
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
});
document.addEventListener('mouseup', () => cursor.classList.remove('pressed'));

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
    setInterval(() => { 
        document.getElementById('cpu-val').innerText = Math.floor(Math.random()*15)+5; 
    }, 2000);
});
