// Each generator yields one visible operation. The controller owns rendering and timing.
const sortingAlgorithms = {
  *bubble(a, demo) {
    for (let end = a.length - 1; end > 0; end--) {
      for (let j = 0; j < end; j++) {
        if (a[j] > a[j + 1]) demo.swap(j, j + 1);
        yield { active: [j], compared: [j + 1] };
      }
      demo.settled.add(end);
    }
  },
  *cocktailshaker(a, demo) {
    let left = 0, right = a.length - 1;
    while (left < right) {
      for (let i = left; i < right; i++) {
        if (a[i] > a[i + 1]) demo.swap(i, i + 1);
        yield { active: [i], compared: [i + 1] };
      }
      demo.settled.add(right--);
      for (let i = right; i > left; i--) {
        if (a[i] < a[i - 1]) demo.swap(i, i - 1);
        yield { active: [i], compared: [i - 1] };
      }
      demo.settled.add(left++);
    }
  },
  *insertion(a, demo) {
    for (let i = 1; i < a.length; i++) {
      let j = i;
      while (j > 0) {
        const move = a[j] < a[j - 1];
        if (move) demo.swap(j, j - 1);
        yield { active: [j], compared: [j - 1] };
        if (!move) break;
        j--;
      }
    }
  },
  *selection(a, demo) {
    for (let i = 0; i < a.length - 1; i++) {
      let minimum = i;
      for (let j = i + 1; j < a.length; j++) {
        if (a[j] < a[minimum]) minimum = j;
        yield { active: [minimum], compared: [j] };
      }
      if (i !== minimum) demo.swap(i, minimum);
      demo.settled.add(i);
      yield { active: [minimum] };
    }
  },
  *oddeven(a, demo) {
    let changed;
    do {
      changed = false;
      // Both phases must be quiet before the array is considered sorted.
      for (let phase = 0; phase < 2; phase++) {
        for (let i = phase; i + 1 < a.length; i += 2) {
          if (a[i] > a[i + 1]) {
            demo.swap(i, i + 1);
            changed = true;
          }
          yield { active: [i], compared: [i + 1] };
        }
      }
    } while (changed);
  },
  *shell(a, demo) {
    for (let gap = Math.floor(a.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
      for (let i = gap; i < a.length; i++) {
        const value = a[i];
        let j = i;
        while (j >= gap && a[j - gap] > value) {
          a[j] = a[j - gap];
          demo.operations++;
          yield { active: [j], compared: [j - gap] };
          j -= gap;
        }
        a[j] = value;
        demo.operations++;
        yield { active: [j], compared: [i] };
      }
    }
  },
  *quick(a, demo, start = 0, end = a.length) {
    if (end - start < 2) {
      if (end > start) demo.settled.add(start);
      return;
    }
    const pivot = a[end - 1];
    let boundary = start;
    for (let j = start; j < end - 1; j++) {
      const target = boundary;
      if (a[j] <= pivot) demo.swap(boundary++, j);
      yield { active: [end - 1], compared: [j, target] };
    }
    demo.swap(boundary, end - 1);
    demo.settled.add(boundary);
    yield {};
    yield* sortingAlgorithms.quick(a, demo, start, boundary);
    yield* sortingAlgorithms.quick(a, demo, boundary + 1, end);
  },
  *merge(a, demo, start = 0, end = a.length) {
    if (end - start < 2) return;
    const middle = start + Math.floor((end - start) / 2);
    yield* sortingAlgorithms.merge(a, demo, start, middle);
    yield* sortingAlgorithms.merge(a, demo, middle, end);
    const left = a.slice(start, middle), right = a.slice(middle, end);
    let i = 0, j = 0;
    for (let k = start; k < end; k++) {
      if (i < left.length && (j === right.length || left[i] <= right[j])) a[k] = left[i++];
      else a[k] = right[j++];
      demo.operations++;
      // Only the final merge establishes final positions in the whole array.
      if (start === 0 && end === a.length) demo.settled.add(k);
      yield { active: [k], compared: k + 1 < end ? [k + 1] : [] };
    }
  },
};

class SortingDemo {
  constructor(name) {
    this.name = name;
    this.canvas = document.getElementById(name);
    this.ctx = this.canvas.getContext('2d');
    this.array = document.getElementById(`${name}-tot`);
    this.interval = document.getElementById(`${name}-interval`);
    this.btn = document.getElementById(`${name}-btn`);
    this.counter = document.getElementById(`${name}-swaps`);
    this.status = document.getElementById(`${name}-status`);
    const style = getComputedStyle(this.canvas.closest('.sorting-demo'));
    this.colors = {
      array: style.getPropertyValue('--sort-array').trim() || '#3268a8',
      active: style.getPropertyValue('--sort-active').trim() || '#aa4141',
      compared: style.getPropertyValue('--sort-compare').trim() || '#b66b20',
      settled: style.getPropertyValue('--sort-sorted').trim() || '#367650',
    };
    this.timer = null;
    this.Input();
  }

  number(input, minimum, maximum, fallback) {
    const value = Number(input.value);
    const bounded = Number.isFinite(value) ? Math.min(maximum, Math.max(minimum, Math.floor(value))) : fallback;
    input.value = bounded;
    return bounded;
  }

  Input() {
    this.pause();
    const size = this.number(this.array, 4, 1024, 32);
    this.buffer = Array.from({ length: size }, (_, i) => i + 1);
    // Fisher–Yates gives each permutation the same probability.
    for (let i = size - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.buffer[i], this.buffer[j]] = [this.buffer[j], this.buffer[i]];
    }
    this.operations = 0;
    this.settled = new Set();
    this.iterator = null;
    this.frame = {};
    this.btn.textContent = 'Sort';
    this.status.textContent = 'Ready to sort.';
    this.render();
  }

  swap(i, j) {
    [this.buffer[i], this.buffer[j]] = [this.buffer[j], this.buffer[i]];
    this.operations++;
  }

  pause() {
    if (this.timer !== null) clearInterval(this.timer);
    this.timer = null;
  }

  Sort() {
    if (this.timer !== null) {
      this.pause();
      this.btn.textContent = 'Resume';
      this.status.textContent = 'Paused.';
      return;
    }
    if (!this.iterator) {
      this.operations = 0;
      this.settled.clear();
      this.iterator = sortingAlgorithms[this.name](this.buffer, this);
    }
    const delay = this.number(this.interval, 10, 1000, 100);
    this.btn.textContent = 'Pause';
    this.status.textContent = 'Sorting…';
    this.timer = setInterval(() => this.step(), delay);
  }

  step() {
    const next = this.iterator.next();
    if (next.done) {
      this.pause();
      this.iterator = null;
      this.settled = new Set(this.buffer.map((_, i) => i));
      this.frame = {};
      this.btn.textContent = 'Sort';
      this.status.textContent = 'Sorted.';
    } else this.frame = next.value;
    this.render();
  }

  render() {
    const { ctx, canvas, buffer, colors } = this;
    const width = canvas.width, height = canvas.height;
    // Repaint the entire background on every frame, including the text variant.
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, width, height);
    const padding = 28, top = 80, chartHeight = height - top - padding;
    const barWidth = (width - padding * 2) / buffer.length;
    const maximum = Math.max(...buffer, 1);
    const active = new Set(this.frame.active || []);
    const compared = new Set(this.frame.compared || []);
    ctx.textAlign = 'center';
    ctx.font = `${Math.min(30, barWidth * 0.65)}px system-ui, sans-serif`;
    for (let i = 0; i < buffer.length; i++) {
      const barHeight = buffer[i] / maximum * chartHeight;
      ctx.fillStyle = this.settled.has(i) ? colors.settled : active.has(i) ? colors.active : compared.has(i) ? colors.compared : colors.array;
      const x = padding + i * barWidth, y = height - padding - barHeight;
      ctx.fillRect(x, y, Math.max(0.5, barWidth - Math.min(3, barWidth * 0.15)), barHeight);
      if (buffer.length <= 40) {
        ctx.fillStyle = '#243247';
        ctx.fillText(buffer[i], x + barWidth / 2, y - 10);
      }
    }
    this.counter.textContent = this.operations;
    this.canvas.setAttribute('aria-label', this.status.textContent === 'Sorted.'
      ? `Sorted array of ${buffer.length} values.`
      : `Array of ${buffer.length} values. Red marks active values, orange comparisons, and green settled positions.`);
  }
}

// Keep the names used by the shared Liquid include's button handlers.
var bubble = new SortingDemo('bubble');
var cocktailshaker = new SortingDemo('cocktailshaker');
var insertion = new SortingDemo('insertion');
var selection = new SortingDemo('selection');
var oddeven = new SortingDemo('oddeven');
var shell = new SortingDemo('shell');
var quick = new SortingDemo('quick');
var merge = new SortingDemo('merge');
