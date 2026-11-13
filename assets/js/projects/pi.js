/* Browser controls and drawings. Expensive series run in pi-worker.js. */
(() => {
  'use strict';
  const script = document.currentScript;
  const workerURL = script.dataset.workerUrl;
  const palette = { background: '#f3f4f6', ink: '#243247', blue: '#3268a8', orange: '#b66b20', green: '#367650', red: '#aa4141', pale: '#e1ebf6' };
  const disposers = [];
  const output = (card, name, value) => {
    const node = card.querySelector(`[data-output="${name}"]`);
    if (node) node.textContent = value;
  };
  const input = (card, name) => card.querySelector(`[data-input="${name}"]`);
  const button = (card, name) => card.querySelector(`[data-action="${name}"]`);
  function bounded(field, fallback) {
    const parsed = field.value.trim() === '' ? NaN : Number(field.value);
    const value = Number.isFinite(parsed) ? Math.min(Number(field.max), Math.max(Number(field.min), Math.floor(parsed))) : fallback;
    field.value = value;
    return value;
  }
  function background(canvas) {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = palette.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return ctx;
  }

  // Unit-circle chord lengths; the rationalized recurrence avoids cancellation.
  function polygonBounds(sides) {
    let n = 6, chord = 1;
    while (n < sides) {
      chord /= Math.sqrt(2 + Math.sqrt(4 - chord * chord));
      n *= 2;
    }
    return { lower: n * chord / 2, upper: n * chord / Math.sqrt(4 - chord * chord) };
  }
  function polygonDemo(card) {
    const field = input(card, 'sides'), canvas = card.querySelector('canvas');
    function draw() {
      const n = Number(field.value), result = polygonBounds(n);
      output(card, 'lower', result.lower.toPrecision(15));
      output(card, 'upper', result.upper.toPrecision(15));
      output(card, 'gap', (result.upper - result.lower).toExponential(4));
      output(card, 'status', `${n.toLocaleString()} sides; approximations evaluated with floating-point arithmetic.`);
      const ctx = background(canvas), center = canvas.width / 2, radius = canvas.width * 0.32;
      ctx.strokeStyle = '#7b8796'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(center, center, radius, 0, 2 * Math.PI); ctx.stroke();
      const visibleSides = Math.min(n, 384);
      for (const [color, outer] of [[palette.orange, true], [palette.blue, false]]) {
        const r = outer ? radius / Math.cos(Math.PI / visibleSides) : radius;
        const rotation = outer ? Math.PI / visibleSides : 0;
        ctx.beginPath();
        for (let i = 0; i <= visibleSides; i++) {
          const angle = 2 * Math.PI * i / visibleSides + rotation;
          const x = center + r * Math.cos(angle), y = center - r * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.stroke();
      }
      ctx.fillStyle = palette.ink; ctx.font = '23px system-ui'; ctx.textAlign = 'center';
      ctx.fillText(`${n.toLocaleString()} sides`, center, canvas.height - 35);
    }
    field.addEventListener('change', draw);
    draw();
  }

  function seriesDemo(card, method) {
    const field = input(card, 'terms'), start = button(card, 'calculate'), cancel = button(card, 'cancel');
    const progress = card.querySelector('progress');
    let worker = null;
    function stop(message) {
      if (worker) worker.terminate();
      worker = null;
      start.disabled = false; cancel.disabled = true; field.disabled = false;
      if (message) output(card, 'status', message);
    }
    function calculate() {
      stop();
      const terms = bounded(field, method === 'leibniz' ? 1000 : 1);
      if (!window.Worker) {
        output(card, 'status', 'This browser does not support background workers. The formulas and source examples remain available below.');
        return;
      }
      progress.value = 0;
      output(card, 'estimate', 'Calculating…');
      output(card, 'status', 'Calculating in the background…');
      try {
        const job = new Worker(workerURL);
        worker = job; start.disabled = true; cancel.disabled = false; field.disabled = true;
        job.onmessage = ({ data }) => {
          if (worker !== job) return;
          if (data.type === 'progress') progress.value = data.completed / data.terms;
          else if (data.type === 'result') {
            output(card, 'estimate', data.estimate);
            if (method === 'leibniz') output(card, 'bound', `≤ ${data.bound.toExponential(5)} (exact-arithmetic bound)`);
            else output(card, 'precision', `${data.precision} significant digits`);
            progress.value = 1;
            stop(`Completed ${data.terms.toLocaleString()} ${data.terms === 1 ? 'term' : 'terms'}.`);
          } else if (data.type === 'error') {
            output(card, 'estimate', '—'); stop(data.message);
          }
        };
        job.onerror = () => { output(card, 'estimate', '—'); stop('The calculation could not load. Reload the page to try again.'); };
        job.postMessage({ method, terms });
      } catch (_) {
        output(card, 'estimate', '—'); stop('The calculation could not start. Reload the page to try again.');
      }
    }
    start.addEventListener('click', calculate);
    cancel.addEventListener('click', () => { output(card, 'estimate', '—'); stop('Cancelled. Change the number of terms and calculate again.'); });
    field.addEventListener('keydown', (event) => { if (event.key === 'Enter') calculate(); });
    disposers.push(() => stop());
    calculate();
  }

  // Find the next impact analytically instead of hoping a time step detects it.
  function collisionEvent(state) {
    const wallTime = state.v1 < 0 ? -state.x1 / state.v1 : Infinity;
    const pairTime = state.v1 > state.v2 ? Math.max(0, state.x2 - state.x1 - 0.5) / (state.v1 - state.v2) : Infinity;
    const time = Math.min(wallTime, pairTime);
    if (!Number.isFinite(time)) return false;
    state.x1 += state.v1 * time;
    state.x2 += state.v2 * time;
    if (wallTime <= pairTime) {
      state.x1 = 0; state.v1 = -state.v1; state.hit = 'wall';
    } else {
      state.x1 = state.x2 - 0.5;
      const v1 = state.v1, v2 = state.v2, mass = state.mass;
      state.v1 = (1 - mass) / (1 + mass) * v1 + 2 * mass / (1 + mass) * v2;
      state.v2 = 2 / (1 + mass) * v1 + (mass - 1) / (1 + mass) * v2;
      state.hit = 'pair';
    }
    state.count++;
    return true;
  }
  function collisionDemo(card) {
    const digits = input(card, 'digits'), speed = input(card, 'speed'), start = button(card, 'start');
    const canvas = card.querySelector('canvas');
    let state, timer = null, complete = false;
    function pause() { if (timer !== null) clearInterval(timer); timer = null; }
    function render() {
      output(card, 'count', state.count.toLocaleString());
      const places = Number(digits.value) - 1;
      output(card, 'estimate', (state.count / 10 ** places).toFixed(places));
      const ctx = background(canvas), floor = canvas.height - 60;
      const scale = (canvas.width - 100) / Math.max(7, state.x2 + 2, state.x1 + 1);
      const left = 45, x1 = left + state.x1 * scale, x2 = left + state.x2 * scale;
      ctx.fillStyle = state.hit === 'wall' ? palette.orange : palette.ink;
      ctx.fillRect(left - 15, 35, 15, floor - 35);
      ctx.strokeStyle = '#7b8796'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(left, floor); ctx.lineTo(canvas.width - 25, floor); ctx.stroke();
      ctx.fillStyle = palette.blue; ctx.fillRect(x1, floor - 60, 0.5 * scale, 60);
      ctx.fillStyle = state.hit === 'pair' ? palette.orange : palette.red;
      ctx.fillRect(x2, floor - 100, scale, 100);
      ctx.fillStyle = palette.ink; ctx.font = '22px system-ui'; ctx.textAlign = 'left';
      ctx.fillText('m = 1', left, 28);
      ctx.fillText(`M = ${state.mass.toLocaleString()}`, canvas.width / 2, 28);
      ctx.font = '19px system-ui'; ctx.fillText(`v₁ = ${state.v1.toPrecision(3)} · v₂ = ${state.v2.toPrecision(3)}`, left, canvas.height - 20);
    }
    function reset() {
      pause(); complete = false;
      const d = Number(digits.value);
      state = { mass: 100 ** (d - 1), x1: 2, x2: 4, v1: 0, v2: -1, count: 0, hit: '' };
      output(card, 'estimate', '—'); output(card, 'mass', state.mass.toLocaleString());
      output(card, 'status', 'Ready. Count both block–block and block–wall collisions.');
      start.textContent = 'Start'; render();
    }
    function tick() {
      for (let i = 0; i < Number(speed.value); i++) {
        if (!collisionEvent(state)) {
          pause(); complete = true; start.textContent = 'Run again';
          const count = String(state.count);
          output(card, 'estimate', count.length > 1 ? `${count[0]}.${count.slice(1)}` : count);
          output(card, 'status', 'Complete. Both blocks move away without another impact.');
          break;
        }
      }
      render();
    }
    start.addEventListener('click', () => {
      if (timer !== null) { pause(); start.textContent = 'Resume'; output(card, 'status', 'Paused.'); }
      else {
        if (complete) reset();
        start.textContent = 'Pause'; output(card, 'status', 'Counting collision events…');
        timer = setInterval(tick, 160);
      }
    });
    button(card, 'reset').addEventListener('click', reset);
    digits.addEventListener('change', reset);
    disposers.push(pause); reset();
  }

  function seededRandom(seed) {
    let state = seed >>> 0;
    return () => {
      state = (state + 0x6d2b79f5) >>> 0;
      let t = state;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function monteCarloDemo(card) {
    const samples = input(card, 'samples'), seed = input(card, 'seed'), speed = input(card, 'speed'), start = button(card, 'start');
    const canvas = card.querySelector('canvas'), ctx = canvas.getContext('2d');
    const pad = 35, size = canvas.width - 2 * pad;
    let total = 0, inside = 0, random, target, frame = null, lastUpdate = 0;
    function pause() { if (frame !== null) cancelAnimationFrame(frame); frame = null; }
    function drawBase() {
      background(canvas);
      ctx.fillStyle = palette.pale; ctx.beginPath(); ctx.moveTo(pad, pad + size);
      ctx.arc(pad, pad + size, size, -Math.PI / 2, 0); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = palette.blue; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(pad, pad + size, size, -Math.PI / 2, 0); ctx.stroke();
      ctx.strokeStyle = '#7b8796'; ctx.strokeRect(pad, pad, size, size);
      ctx.fillStyle = palette.ink; ctx.font = '20px system-ui'; ctx.textAlign = 'left';
      ctx.fillText('0', pad - 20, canvas.height - 13); ctx.fillText('1', canvas.width - pad, canvas.height - 13); ctx.fillText('1', 10, pad);
    }
    function reset() {
      pause(); target = bounded(samples, 10000); random = seededRandom(bounded(seed, 314159));
      total = 0; inside = 0; lastUpdate = 0;
      start.textContent = 'Start'; samples.disabled = false; seed.disabled = false;
      output(card, 'estimate', '—'); output(card, 'count', '0'); output(card, 'interval', 'Needs at least 30 samples');
      output(card, 'status', 'Ready. The same seed reproduces the same samples.'); drawBase();
    }
    function tick(timestamp) {
      // Limit visual updates independently of the display's refresh rate.
      if (timestamp - lastUpdate < 80) {
        frame = requestAnimationFrame(tick);
        return;
      }
      lastUpdate = timestamp;
      const limit = Math.min(target, total + Number(speed.value));
      while (total < limit) {
        const x = random(), y = random(), hit = x * x + y * y <= 1;
        total++; if (hit) inside++;
        if (total <= 20000) {
          ctx.fillStyle = hit ? palette.green : palette.red;
          ctx.fillRect(pad + x * size, pad + (1 - y) * size, 2, 2);
        }
      }
      const p = inside / total;
      output(card, 'estimate', (4 * p).toFixed(8)); output(card, 'count', `${total.toLocaleString()} / ${target.toLocaleString()}`);
      if (total >= 30) {
        const half = 1.96 * 4 * Math.sqrt(p * (1 - p) / total);
        output(card, 'interval', `${Math.max(0, 4 * p - half).toFixed(5)} – ${Math.min(4, 4 * p + half).toFixed(5)}`);
      }
      if (total < target) frame = requestAnimationFrame(tick);
      else {
        frame = null; start.textContent = 'Run again'; samples.disabled = false; seed.disabled = false;
        output(card, 'status', 'Complete. Change the seed and reset to try a different sample.');
      }
    }
    start.addEventListener('click', () => {
      if (frame !== null) { pause(); start.textContent = 'Resume'; output(card, 'status', 'Paused.'); }
      else {
        if (total === 0 || total >= target) reset();
        samples.disabled = true; seed.disabled = true;
        lastUpdate = 0;
        start.textContent = 'Pause'; output(card, 'status', 'Sampling points…');
        frame = requestAnimationFrame(tick);
      }
    });
    button(card, 'reset').addEventListener('click', reset);
    samples.addEventListener('change', reset); seed.addEventListener('change', reset);
    disposers.push(pause); reset();
  }

  document.querySelectorAll('[data-pi-demo]').forEach((card) => {
    const method = card.dataset.piDemo;
    if (method === 'polygon') polygonDemo(card);
    else if (method === 'collisions') collisionDemo(card);
    else if (method === 'monte-carlo') monteCarloDemo(card);
    else seriesDemo(card, method);
  });
  window.addEventListener('pagehide', () => disposers.forEach((dispose) => dispose()));
})();
