const canvas = document.getElementById('luces');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const secciones = [
  {
    id: 'sobre-nosotros',
    particulas: 40,
    gen: () => ({
      color: ['rgba(255,200,50,','rgba(220,160,0,','rgba(255,230,100,'][Math.floor(Math.random()*3)],
      r: Math.random()*6+3,
      vx: (Math.random()-0.5)*0.4,
      vy: -(Math.random()*0.5+0.15),
      fade: Math.random()*0.003+0.001,
    })
  },
  {
    id: 'mision-vision',
    particulas: 35,
    gen: () => ({
      color: ['rgba(220,50,50,','rgba(180,30,30,','rgba(255,80,30,'][Math.floor(Math.random()*3)],
      r: Math.random()*7+4,
      vx: (Math.random()-0.5)*0.2,
      vy: -(Math.random()*0.3+0.05),
      fade: Math.random()*0.002+0.0005,
      pulso: Math.random()*Math.PI*2,
    })
  },
  {
    id: 'contribuidores',
    particulas: 50,
    gen: () => {
      const cols = ['rgba(255,100,100,','rgba(255,180,50,','rgba(100,180,255,','rgba(150,255,150,','rgba(220,100,255,'];
      return {
        color: cols[Math.floor(Math.random()*cols.length)],
        r: Math.random()*5+2,
        vx: (Math.random()-0.5)*1.2,
        vy: -(Math.random()*1+0.3),
        fade: Math.random()*0.005+0.002,
      };
    }
  },
  {
    id: 'privacidad',
    particulas: 30,
    gen: () => ({
      color: ['rgba(80,150,255,','rgba(50,100,220,','rgba(150,200,255,'][Math.floor(Math.random()*3)],
      r: Math.random()*5+2,
      vx: (Math.random()-0.5)*0.2,
      vy: -(Math.random()*0.25+0.08),
      fade: Math.random()*0.002+0.0005,
    })
  },
  {
    id: 'terminos',
    particulas: 25,
    gen: () => ({
      color: ['rgba(200,200,200,','rgba(160,160,160,','rgba(230,230,230,'][Math.floor(Math.random()*3)],
      r: Math.random()*4+2,
      vx: (Math.random()-0.5)*0.3,
      vy: -(Math.random()*0.2+0.05),
      fade: Math.random()*0.002+0.0005,
    })
  },
  {
    id: 'agradecimientos',
    particulas: 60,
    gen: () => {
      const cols = ['rgba(255,200,50,','rgba(220,50,50,','rgba(255,150,30,','rgba(255,240,120,'];
      return {
        color: cols[Math.floor(Math.random()*cols.length)],
        r: Math.random()*7+3,
        vx: (Math.random()-0.5)*0.8,
        vy: -(Math.random()*0.7+0.2),
        fade: Math.random()*0.004+0.001,
        giro: (Math.random()-0.5)*0.05,
      };
    }
  },
];

const pools = {};
secciones.forEach(s => {
  pools[s.id] = Array.from({length: s.particulas}, () => {
    const p = s.gen();
    return { ...p, x: Math.random(), yRel: Math.random(), alpha: Math.random()*0.5+0.1, pulso: p.pulso||0, giro: p.giro||0 };
  });
});

function getRects() {
  const rects = {};
  document.querySelectorAll('[data-luces]').forEach(el => {
    rects[el.dataset.luces] = el.getBoundingClientRect();
  });
  return rects;
}

function dibujarSeccion(sec, rect, particulas, t) {
  const { left, top, width, height } = rect;
  particulas.forEach(p => {
    const px = left + p.x * width;
    const py = top + p.yRel * height;
    let alpha = p.alpha;
    if (sec.id === 'mision-vision') {
      alpha = p.alpha * (0.5 + 0.5 * Math.sin(t * 0.03 + p.pulso));
    }
    ctx.shadowBlur = 0;
    if (sec.id === 'agradecimientos') {
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(p.giro * t);
      ctx.fillStyle = p.color + alpha + ')';
      ctx.fillRect(-p.r, -p.r*2, p.r*2, p.r*4);
      ctx.restore();
    } else {
      ctx.beginPath();
      ctx.arc(px, py, p.r, 0, Math.PI*2);
      ctx.fillStyle = p.color + alpha + ')';
      ctx.shadowBlur = sec.id === 'privacidad' ? 10 : 16;
      ctx.shadowColor = p.color + '0.6)';
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    p.x += p.vx / width;
    p.yRel += p.vy / height;
    p.alpha -= p.fade;

    if (p.alpha <= 0 || p.yRel < -0.05) {
      const np = sec.gen();
      p.color = np.color;
      p.r = np.r;
      p.vx = np.vx;
      p.vy = np.vy;
      p.fade = np.fade;
      p.giro = np.giro || 0;
      p.pulso = np.pulso || 0;
      p.x = Math.random();
      p.yRel = 1.05;
      p.alpha = Math.random()*0.4+0.15;
    }
    if (p.x < 0) p.x = 1;
    if (p.x > 1) p.x = 0;
  });
}

let t = 0;
function animar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const rects = getRects();
  secciones.forEach(sec => {
    const rect = rects[sec.id];
    if (rect && rect.width > 0) {
      dibujarSeccion(sec, rect, pools[sec.id], t);
    }
  });
  t++;
  requestAnimationFrame(animar);
}
animar();