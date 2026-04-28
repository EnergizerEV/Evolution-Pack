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
    
    // Берем цвет сетки из CSS переменных
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--current-accent').trim();
    
    ctx.strokeStyle = accent;
    ctx.lineWidth = 0.5;
    
    for (let x = 0; x < canvas.width; x += size) {
        for (let y = 0; y < canvas.height; y += size) {
            const dist = Math.hypot(x - mouse.x, y - mouse.y);
            const offset = Math.max(0, 10 - dist / 30);
            
            // В режиме RED сетка становится чуть более "кровавой"
            ctx.globalAlpha = offset > 0 ? 0.5 : 0.12;
            
            ctx.strokeRect(x - offset/2, y - offset/2, size + offset, size + offset);
        }
    }
    requestAnimationFrame(drawGrid);
}
drawGrid();

document.addEventListener('mousemove', (e) => {
    if (window.innerWidth <= 768) return;
    
    mouse.x = e.clientX; 
    mouse.y = e.clientY;
    
    // Позиция курсора
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;

    // ПЕРЕДАЕМ КООРДИНАТЫ ДЛЯ CSS (Фонарик)
    const xPct = (e.clientX / window.innerWidth) * 100;
    const yPct = (e.clientY / window.innerHeight) * 100;
    document.documentElement.style.setProperty('--mouse-x', `${xPct}%`);
    document.documentElement.style.setProperty('--mouse-y', `${yPct}%`);
    
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Параллакс и 3D-повороты
    document.querySelectorAll('.parallax-layer').forEach(layer => {
        const str = layer.getAttribute('data-strength');
        const transX = (e.clientX - centerX) / str;
        const transY = (e.clientY - centerY) / str;

        if (layer.classList.contains('card')) {
            const isHovered = layer.matches(':hover');
            if (isHovered) {
                const rect = layer.getBoundingClientRect();
                const cardCenterX = rect.left + rect.width / 2;
                const cardCenterY = rect.top + rect.height / 2;
                const rotateY = (e.clientX - cardCenterX) / 25; 
                const rotateX = (cardCenterY - e.clientY) / 25;
                layer.style.transform = `translate3d(${transX}px, ${transY}px, 0) scale(1.03) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            } else {
                layer.style.transform = `translate3d(${transX}px, ${transY}px, 0) scale(1) rotateX(0deg) rotateY(0deg)`;
            }
        } else {
            layer.style.transform = `translate3d(${transX}px, ${transY}px, 0)`;
        }
    });
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

const consoleEl = document.getElementById('term-console');
const inputEl = document.getElementById('term-input');
const modeText = document.getElementById('mode-text');

window.addEventListener('keydown', (e) => {
    if (e.code === 'Backquote') {
        e.preventDefault();
        consoleEl.classList.toggle('active'); // Добавляет/убирает класс active
        if (consoleEl.classList.contains('active')) {
            inputEl.focus(); // Сразу ставит курсор в поле ввода
        }
    }
});

inputEl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const cmd = inputEl.value.toLowerCase().trim();
        if (cmd === 'red') {
    document.documentElement.style.setProperty('--current-accent', '#ff0000');
    document.body.style.backgroundColor = "#0a0000"; // Это свойство теперь будет меняться ПЛАВНО
    document.body.classList.add('red-mode');
            
            logoMain.style.backgroundImage = "url('Project_Night_Icon.png')";
            logoErr.style.backgroundImage = "url('Project_Night_Icon_ERR.png')";
            logoMain.style.filter = "drop-shadow(0 0 20px rgba(255, 0, 0, 0.5))";
            
            modeText.innerText = "NIGHT_PROTOCOL";
        } 
        else if (cmd === 'aqua') {
    document.documentElement.style.setProperty('--current-accent', '#00ffd8');
    document.body.style.backgroundColor = "#06080a"; // И это тоже
    document.body.classList.remove('red-mode');
            
            logoMain.style.backgroundImage = "url('EV_Dark_2k.png')";
            logoErr.style.backgroundImage = "url('EV_Dark_2k_ERR.png')";
            logoMain.style.filter = "drop-shadow(0 0 15px var(--current-accent))";
            
            modeText.innerText = "AQUA_CORE";
        }
        if (cmd === 'clear') consoleEl.classList.remove('active');
        inputEl.value = '';
    }
});

function startTyping() {
    document.querySelectorAll('.type-output').forEach(el => {
        const text = el.getAttribute('data-text');
        if(!text) return;
        let i = 0; el.innerText = '';
        const type = setInterval(() => {
            el.innerText += text[i]; i++;
            if (i >= text.length) clearInterval(type);
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
