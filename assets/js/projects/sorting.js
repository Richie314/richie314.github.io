var ran = (n) => Math.floor(Math.random() * 10e8) % n;
const _Colors = {
  Cols: ["#112d4e", "#112d4e", "#dbe2ef"],
  Bg: ["#f9f7f7", "#dbe2ef", "#3f72af"],
};
const STOP = "Stop";
const SORT = "Sort";

var bubble = {
  buffer: [0],
  SwapSimple(i, j) {
    let elem = this.buffer[i];
    this.buffer[i] = this.buffer[j];
    this.buffer[j] = elem;
  },
  Swap(i, j) {
    this.SwapSimple(i, j);
    this.swapsNum++;
  },
  w: 0,
  h: 0,
  swapsNum: 0,
  DrawIndex: false,
  Display() {},
  DisplayColumns() {
    bubble.ctx.clearRect(0, 0, bubble.w, bubble.h);
    //bubble.ctx.fillStyle = '#ffffff'
    bubble.ctx.fillStyle = _Colors.Bg[0];
    bubble.ctx.fillRect(0, 0, bubble.w, bubble.h);
    bubble.ctx.font = bubble.bar.hp + "px Arial";
    for (var i = 0; i < bubble.buffer.length; i++) {
      //bubble.ctx.fillStyle = '#0000ff'
      bubble.ctx.fillStyle = _Colors.Cols[0];
      if (bubble.j === i) {
        //bubble.ctx.fillStyle = '#ff0000'
        bubble.ctx.fillStyle = _Colors.Cols[1];
      }
      bubble.ctx.fillRect(
        i * bubble.bar.wp,
        bubble.bar.hp * (bubble.buffer.length - bubble.buffer[i]),
        bubble.bar.wp,
        bubble.bar.hp * bubble.buffer[i]
      );
    }
    bubble.swaps.innerHTML = bubble.swapsNum + "<br />";
  },
  DisplayColumnsText() {
    bubble.ctx.clearRect(0, 0, bubble.w, bubble.h);
    //bubble.ctx.fillStyle = '#ffffff'
    bubble.ctx.fillStyle = _Colors.Bg[0];
    bubble.ctx.fillRect(0, 0, bubble.w, bubble.h);
    bubble.ctx.font = bubble.bar.hp + "px Arial";
    for (var i = 0; i < bubble.buffer.length; i++) {
      //bubble.ctx.fillStyle = '#0000ff'
      bubble.ctx.fillStyle = _Colors.Cols[0];
      if (bubble.j === i) {
        //bubble.ctx.fillStyle = '#00ff00'
        bubble.ctx.fillStyle = _Colors.Cols[2];
      }
      bubble.ctx.fillRect(
        i * bubble.bar.wp,
        bubble.bar.hp * (bubble.buffer.length - bubble.buffer[i]),
        bubble.bar.wp,
        bubble.bar.hp * bubble.buffer[i]
      );
      bubble.ctx.fillText(bubble.buffer[i], (i + 0.21) * bubble.bar.wp, bubble.bar.hp * (bubble.buffer.length - bubble.buffer[i] - 0.1));
    }
    bubble.swaps.innerHTML = bubble.swapsNum + "<br />";
  },
  Shuffle(size) {
    while (this.buffer.length < size) {
      this.buffer.push(0);
    }
    for (var i = 0; i < this.buffer.length; i++) {
      this.buffer[i] = i;
    }
    for (var i = 0; i < this.buffer.length; i++) {
      this.SwapSimple(i, ran(this.buffer.length));
    }
  },
  Input() {
    this.w = this.canvas.width;
    this.h = (this.w * 2) / 3;
    this.canvas.height = this.h;
    var buff = this.array.value;
    this.swapsNum = 0;
    if (buff > 3) {
      this.buffer = [0];
      for (var i = 0; i < buff - 1; i++) {
        this.buffer.push(0);
      }
      this.Shuffle(this.buffer.length);
      this.bar = {
        wp: bubble.w / bubble.buffer.length,
        hp: bubble.h / bubble.buffer.length,
      };
      if (buff > 40) {
        this.DrawIndex = false;
        this.Display = this.DisplayColumns;
      } else {
        this.DrawText = true;
        this.Display = this.DisplayColumnsText;
      }
      //this.ctx.fillStyle = '#0000ff'
      this.ctx.fillStyle = _Colors.Cols[0];
      this.i = this.buffer.length - 1;
      this.j = -1;
      this.id = 0;
      this.Display();
    }
  },
  i: 0,
  j: -1,
  id: 0,
  Sorting() {
    if (bubble.i > 0 && bubble.id !== 0) {
      if (bubble.j < bubble.i) {
        if (bubble.buffer[bubble.j] > bubble.buffer[bubble.j + 1]) {
          bubble.Swap(bubble.j, bubble.j + 1);
        }
        bubble.j++;
      } else {
        bubble.i--;
        bubble.j = 0;
      }
    } else {
      if (bubble.id !== 0) {
        clearInterval(bubble.id);
        bubble.j = -1;
        bubble.id = 0;
        bubble.btn.innerHTML = SORT;
      }
    }
    requestAnimationFrame(bubble.Display);
  },
  Sort() {
    if (this.id === 0) {
      if (this.interval.value < 10 || this.interval.value > 1000) {
        this.interval.value = 10;
      }
      this.btn.innerHTML = STOP;
      this.j = 0;
      this.id = setInterval(bubble.Sorting, this.interval.value);
      console.log("Bubble sort started with id: " + this.id);
    } else {
      clearInterval(this.id);
      this.id = 0;
      this.btn.innerHTML = SORT;
    }
  },
  Create() {
    this.array = document.getElementById("bubble-tot");
    this.canvas = document.getElementById("bubble");
    this.ctx = this.canvas.getContext("2d");
    this.btn = document.getElementById("bubble-btn");
    this.swaps = document.getElementById("bubble-swaps");
    this.interval = document.getElementById("bubble-interval");
    this.Input();
  },
};
var selection = {
  buffer: [0],
  SwapSimple(i, j) {
    let elem = this.buffer[i];
    this.buffer[i] = this.buffer[j];
    this.buffer[j] = elem;
  },
  Swap(i, j) {
    this.SwapSimple(i, j);
    this.swapsNum++;
  },
  w: 0,
  h: 0,
  swapsNum: 0,
  DrawIndex: false,
  Display() {},
  DisplayColumns() {
    selection.ctx.clearRect(0, 0, selection.w, selection.h);
    //selection.ctx.fillStyle = '#ffffff'
    selection.ctx.fillStyle = _Colors.Bg[0];
    selection.ctx.fillRect(0, 0, selection.w, selection.h);
    selection.ctx.font = selection.bar.hp + "px Arial";
    for (var i = 0; i < selection.buffer.length; i++) {
      //selection.ctx.fillStyle = '#0000ff'
      selection.ctx.fillStyle = _Colors.Cols[0];
      if (selection.index === i) {
        selection.ctx.fillStyle = _Colors.Cols[1];
        //selection.ctx.fillStyle = '#00ff00'
      } else if (selection.j === i) {
        selection.ctx.fillStyle = _Colors.Cols[2];
        //selection.ctx.fillStyle = '#ff0000'
      }
      selection.ctx.fillRect(
        i * selection.bar.wp,
        selection.bar.hp * (selection.buffer.length - selection.buffer[i]),
        selection.bar.wp,
        selection.bar.hp * selection.buffer[i]
      );
    }
    selection.swaps.innerHTML = selection.swapsNum + "<br />";
  },
  DisplayColumnsText() {
    selection.ctx.clearRect(0, 0, selection.w, selection.h);
    //selection.ctx.fillStyle = '#ffffff'
    selection.ctx.fillStyle = _Colors.Bg[0];
    selection.ctx.fillRect(0, 0, selection.w, selection.h);
    selection.ctx.font = selection.bar.hp + "px Arial";
    for (var i = 0; i < selection.buffer.length; i++) {
      //selection.ctx.fillStyle = '#0000ff'
      selection.ctx.fillStyle = _Colors.Cols[0];
      if (selection.index === i) {
        //selection.ctx.fillStyle = '#00ff00'
        selection.ctx.fillStyle = _Colors.Cols[1];
      } else if (selection.j === i) {
        //selection.ctx.fillStyle = '#ff0000'
        selection.ctx.fillStyle = _Colors.Cols[2];
      }
      selection.ctx.fillRect(
        i * selection.bar.wp,
        selection.bar.hp * (selection.buffer.length - selection.buffer[i]),
        selection.bar.wp,
        selection.bar.hp * selection.buffer[i]
      );
      selection.ctx.fillText(
        selection.buffer[i],
        (i + 0.21) * selection.bar.wp,
        selection.bar.hp * (selection.buffer.length - selection.buffer[i] - 0.1)
      );
    }
    selection.swaps.innerHTML = selection.swapsNum + "<br />";
  },
  Shuffle(size) {
    while (this.buffer.length < size) {
      this.buffer.push(0);
    }
    for (var i = 0; i < this.buffer.length; i++) {
      this.buffer[i] = i;
    }
    for (var i = 0; i < this.buffer.length; i++) {
      this.SwapSimple(i, ran(this.buffer.length));
    }
  },
  Input() {
    this.w = this.canvas.width;
    this.h = (this.w * 2) / 3;
    this.canvas.height = this.h;
    var buff = this.array.value;
    this.swapsNum = 0;
    if (buff > 3) {
      this.buffer = [0];
      for (var i = 0; i < buff - 1; i++) {
        this.buffer.push(0);
      }
      this.Shuffle(this.buffer.length);
      this.bar = {
        wp: this.w / this.buffer.length,
        hp: this.h / this.buffer.length,
      };
      if (buff > 40) {
        this.DrawIndex = false;
        this.Display = this.DisplayColumns;
      } else {
        this.DrawText = true;
        this.Display = this.DisplayColumnsText;
      }
      //this.ctx.fillStyle = '#0000ff'
      this.ctx.fillStyle = _Colors.Cols[0];
      this.duration = this.buffer.length - 1;
      this.i = 0;
      this.j = -1;
      this.index = -1;
      this.id = 0;
      this.Display();
    }
  },
  i: 0,
  j: 0,
  duration: 0,
  index: 0,
  id: 0,
  Sorting() {
    if (selection.i < selection.duration && selection.id !== 0) {
      if (selection.j < selection.buffer.length) {
        if (selection.buffer[selection.j] < selection.buffer[selection.index]) selection.index = selection.j;
        selection.j++;
      } else {
        selection.Swap(selection.index, selection.i);
        selection.i++;
        selection.j = selection.i + 1;
        selection.index = selection.i;
      }
    } else {
      if (selection.id !== 0) {
        clearInterval(selection.id);
        selection.j = -1;
        selection.index = -1;
        selection.id = 0;
        selection.btn.innerHTML = SORT;
      }
    }
    requestAnimationFrame(selection.Display);
  },
  Sort() {
    if (this.id === 0) {
      if (this.interval.value < 10 || this.interval.value > 1000) {
        this.interval.value = 10;
      }
      this.swapsNum = 0;
      this.swaps.innerHTML = "0";
      this.btn.innerHTML = STOP;
      this.j = 1;
      this.i = 0;
      this.index = 0;
      this.id = setInterval(selection.Sorting, this.interval.value);
      console.log("Selection sort started with id: " + this.id);
    } else {
      clearInterval(this.id);
      this.id = 0;
      this.btn.innerHTML = SORT;
    }
  },
  Create() {
    this.array = document.getElementById("selection-tot");
    this.canvas = document.getElementById("selection");
    this.ctx = this.canvas.getContext("2d");
    this.btn = document.getElementById("selection-btn");
    this.swaps = document.getElementById("selection-swaps");
    this.interval = document.getElementById("selection-interval");
    this.Input();
  },
};
var quick = {
  buffer: [0],
  sleep() {
    return new Promise((resolve) => setTimeout(resolve, quick.interval.value));
  },

  SwapSimple(i, j) {
    let elem = this.buffer[i];
    this.buffer[i] = this.buffer[j];
    this.buffer[j] = elem;
  },
  async Swap(i, j) {
    await this.sleep();
    this.SwapSimple(i, j);
    this.swapsNum++;
  },
  w: 0,
  h: 0,
  swapsNum: 0,
  Display() {},
  DisplayColumns() {
    quick.check();
    quick.ctx.clearRect(0, 0, quick.w, quick.h);
    //quick.ctx.fillStyle = '#ffffff'
    quick.ctx.fillStyle = _Colors.Bg[0];
    quick.ctx.fillRect(0, 0, quick.w, quick.h);
    quick.ctx.font = quick.bar.hp + "px Arial";
    for (var i = 0; i < quick.buffer.length; i++) {
      //quick.ctx.fillStyle = '#0000ff'
      quick.ctx.fillStyle = _Colors.Cols[0];
      if (quick.pivot === i) {
        //quick.ctx.fillStyle = '#ff0000'
        quick.ctx.fillStyle = _Colors.Cols[1];
      }
      quick.ctx.fillRect(i * quick.bar.wp, quick.bar.hp * (quick.buffer.length - quick.buffer[i]), quick.bar.wp, quick.bar.hp * quick.buffer[i]);
    }
    quick.swaps.innerHTML = quick.swapsNum + "<br />";
    if (quick.order) return;
    requestAnimationFrame(quick.DisplayColumns);
  },
  DisplayColumnsText() {
    quick.check();
    quick.ctx.clearRect(0, 0, quick.w, quick.h);
    //quick.ctx.fillStyle = '#ffffff'
    quick.ctx.fillStyle = _Colors.Bg[0];
    quick.ctx.fillRect(0, 0, quick.w, quick.h);
    quick.ctx.font = quick.bar.hp + "px Arial";
    for (var i = 0; i < quick.buffer.length; i++) {
      //quick.ctx.fillStyle = '#0000ff'
      quick.ctx.fillStyle = _Colors.Cols[0];
      if (quick.pivot === i) {
        //quick.ctx.fillStyle = '#ff0000'
        quick.ctx.fillStyle = _Colors.Cols[1];
      }
      quick.ctx.fillRect(i * quick.bar.wp, quick.bar.hp * (quick.buffer.length - quick.buffer[i]), quick.bar.wp, quick.bar.hp * quick.buffer[i]);
      quick.ctx.fillText(quick.buffer[i], (i + 0.21) * quick.bar.wp, quick.bar.hp * (quick.buffer.length - quick.buffer[i] - 0.1));
    }
    quick.swaps.innerHTML = quick.swapsNum + "<br />";
    if (quick.order) return;
    requestAnimationFrame(quick.DisplayColumnsText);
  },
  Shuffle(size) {
    while (this.buffer.length < size) {
      this.buffer.push(0);
    }
    for (var i = 0; i < this.buffer.length; i++) {
      this.buffer[i] = i;
    }
    for (var i = 0; i < this.buffer.length; i++) {
      this.SwapSimple(i, ran(this.buffer.length));
    }
  },
  Input() {
    this.w = this.canvas.width;
    this.h = (this.w * 2) / 3;
    this.canvas.height = this.h;
    var buff = this.array.value;
    this.swapsNum = 0;
    if (buff > 3) {
      this.buffer = [0];
      for (var i = 0; i < buff - 1; i++) {
        this.buffer.push(0);
      }
      this.Shuffle(this.buffer.length);
      this.bar = {
        wp: this.w / this.buffer.length,
        hp: this.h / this.buffer.length,
      };
      if (buff > 40) {
        this.DrawIndex = false;
        this.Display = this.DisplayColumns;
      } else {
        this.DrawText = true;
        this.Display = this.DisplayColumnsText;
      }
      //this.ctx.fillStyle = '#0000ff'
      this.ctx.fillStyle = _Colors.Cols[0];
      this.pivot = -1;
      this.id = 0;
      this.order = false;
      this.Display();
    }
  },
  id: 0,
  pivot: -1,
  order: false,
  checkcount: 0,
  check() {
    let order = true;
    for (let i = 1; i < quick.buffer.length; i++) if (quick.buffer[i] < quick.buffer[i - 1]) order = false;
    if (order) {
      quick.pivot = -1;
    }
    quick.order = order;
  },
  /**
   *
   * @param {number} a
   * @param {number} b
   */
  async part(a, b) {
    let x = this.buffer[b];
    let i = a - 1;
    this.l = a;
    for (var j = a; j < b; j++) {
      if (this.buffer[j] <= x) {
        i++;
        await this.Swap(i, j);
      }
    }
    await this.Swap(i + 1, b);
    return i + 1;
  },
  async Sorting(l, h) {
    if (l < h) {
      let pivot = await quick.part(l, h);
      quick.pivot = pivot;
      await quick.Sorting(l, pivot - 1);
      await quick.Sorting(pivot + 1, h);
    }
  },
  Sort() {
    if (!this.order) {
      if (this.interval.value < 10 || this.interval.value > 10000) {
        this.interval.value = 10;
      }
      this.swapsNum = 0;
      this.swaps.innerHTML = "0";
      this.Sorting(0, this.buffer.length - 1);
      this.id = requestAnimationFrame(this.Display);
    } else {
      this.l = -1;
      this.p = -1;
    }
  },
  Create() {
    this.array = document.getElementById("quick-tot");
    this.canvas = document.getElementById("quick");
    this.ctx = this.canvas.getContext("2d");
    this.btn = document.getElementById("quick-btn");
    this.swaps = document.getElementById("quick-swaps");
    this.interval = document.getElementById("quick-interval");
    this.Input();
  },
};
var cocktailshaker = {
  buffer: [0],
  SwapSimple(i, j) {
    let elem = this.buffer[i];
    this.buffer[i] = this.buffer[j];
    this.buffer[j] = elem;
  },
  Swap(i, j) {
    this.SwapSimple(i, j);
    this.swapsNum++;
  },
  w: 0,
  h: 0,
  swapsNum: 0,
  DrawIndex: false,
  Display() {},
  DisplayColumns() {
    cocktailshaker.ctx.clearRect(0, 0, cocktailshaker.w, cocktailshaker.h);
    //cocktailshaker.ctx.fillStyle = '#ffffff'
    cocktailshaker.ctx.fillStyle = _Colors.Bg[0];
    cocktailshaker.ctx.fillRect(0, 0, cocktailshaker.w, cocktailshaker.h);
    cocktailshaker.ctx.font = cocktailshaker.bar.hp + "px Arial";
    for (var i = 0; i < cocktailshaker.buffer.length; i++) {
      //cocktailshaker.ctx.fillStyle = '#0000ff'
      cocktailshaker.ctx.fillStyle = _Colors.Cols[0];
      if (cocktailshaker.n === i) {
        //cocktailshaker.ctx.fillStyle = '#00ff00'
        cocktailshaker.ctx.fillStyle = _Colors.Cols[1];
      } else if (cocktailshaker.i === i) {
        //cocktailshaker.ctx.fillStyle = '#ff0000'
        cocktailshaker.ctx.fillStyle = _Colors.Cols[1];
      } else if (cocktailshaker.c === i) {
        //cocktailshaker.ctx.fillStyle = '#ffff00'
        cocktailshaker.ctx.fillStyle = _Colors.Cols[2];
      }
      cocktailshaker.ctx.fillRect(
        i * cocktailshaker.bar.wp,
        cocktailshaker.bar.hp * (cocktailshaker.buffer.length - cocktailshaker.buffer[i]),
        cocktailshaker.bar.wp,
        cocktailshaker.bar.hp * cocktailshaker.buffer[i]
      );
    }
    cocktailshaker.swaps.innerHTML = cocktailshaker.swapsNum + "<br />";
  },
  DisplayColumnsText() {
    cocktailshaker.ctx.clearRect(0, 0, cocktailshaker.w, cocktailshaker.h);
    //cocktailshaker.ctx.fillStyle = '#ffffff'
    cocktailshaker.ctx.fillStyle = _Colors.Bg[0];
    cocktailshaker.ctx.fillRect(0, 0, cocktailshaker.w, cocktailshaker.h);
    cocktailshaker.ctx.font = cocktailshaker.bar.hp + "px Arial";
    for (var i = 0; i < cocktailshaker.buffer.length; i++) {
      //cocktailshaker.ctx.fillStyle = '#0000ff'
      cocktailshaker.ctx.fillStyle = _Colors.Cols[0];
      if (cocktailshaker.n === i) {
        //cocktailshaker.ctx.fillStyle = '#00ff00'
        cocktailshaker.ctx.fillStyle = _Colors.Cols[1];
      } else if (cocktailshaker.i === i) {
        //cocktailshaker.ctx.fillStyle = '#ff0000'
        cocktailshaker.ctx.fillStyle = _Colors.Cols[1];
      } else if (cocktailshaker.c === i) {
        //cocktailshaker.ctx.fillStyle = '#ffff00'
        cocktailshaker.ctx.fillStyle = _Colors.Cols[2];
      }
      cocktailshaker.ctx.fillRect(
        i * cocktailshaker.bar.wp,
        cocktailshaker.bar.hp * (cocktailshaker.buffer.length - cocktailshaker.buffer[i]),
        cocktailshaker.bar.wp,
        cocktailshaker.bar.hp * cocktailshaker.buffer[i]
      );
      cocktailshaker.ctx.fillText(
        cocktailshaker.buffer[i],
        (i + 0.21) * cocktailshaker.bar.wp,
        cocktailshaker.bar.hp * (cocktailshaker.buffer.length - cocktailshaker.buffer[i] - 0.1)
      );
    }
    cocktailshaker.swaps.innerHTML = cocktailshaker.swapsNum + "<br>";
  },
  Shuffle(size) {
    while (this.buffer.length < size) {
      this.buffer.push(0);
    }
    for (var i = 0; i < this.buffer.length; i++) {
      this.buffer[i] = i;
    }
    for (var i = 0; i < this.buffer.length; i++) {
      this.SwapSimple(i, ran(this.buffer.length));
    }
  },
  Input() {
    this.w = this.canvas.width;
    this.h = (this.w * 2) / 3;
    this.canvas.height = this.h;
    var buff = this.array.value;
    this.swapsNum = 0;
    if (buff > 3) {
      this.buffer = [0];
      for (var i = 0; i < buff - 1; i++) {
        this.buffer.push(0);
      }
      this.Shuffle(this.buffer.length);
      this.bar = {
        wp: cocktailshaker.w / cocktailshaker.buffer.length,
        hp: cocktailshaker.h / cocktailshaker.buffer.length,
      };
      if (buff > 40) {
        this.DrawIndex = false;
        this.Display = this.DisplayColumns;
      } else {
        this.DrawText = true;
        this.Display = this.DisplayColumnsText;
      }
      //this.ctx.fillStyle = '#0000ff'
      this.ctx.fillStyle = _Colors.Cols[0];
      this.i = -1;
      this.id = 0;
      this.n = -1;
      this.c = -1;
      this.up = true;
      this.Display();
      this.c = 0;
      this.i = 0;
      this.n = this.buffer.length - 1;
    }
  },
  i: -1,
  n: -1,
  c: -1,
  up: true,
  id: 0,
  Sorting() {
    if (cocktailshaker.n - cocktailshaker.c > 1 && cocktailshaker.id !== 0) {
      if (cocktailshaker.up) {
        if (cocktailshaker.i < cocktailshaker.n) {
          if (cocktailshaker.buffer[cocktailshaker.i] > cocktailshaker.buffer[cocktailshaker.i + 1]) {
            cocktailshaker.Swap(cocktailshaker.i, cocktailshaker.i + 1);
          }
          cocktailshaker.i++;
        } else {
          cocktailshaker.up = false;
          cocktailshaker.n--;
          cocktailshaker.i = cocktailshaker.n; //////
        }
      } else {
        if (cocktailshaker.i > cocktailshaker.c) {
          if (cocktailshaker.buffer[cocktailshaker.i] < cocktailshaker.buffer[cocktailshaker.i - 1]) {
            cocktailshaker.Swap(cocktailshaker.i, cocktailshaker.i - 1);
          }
          cocktailshaker.i--;
        } else {
          cocktailshaker.up = true;
          cocktailshaker.c++;
          cocktailshaker.i = cocktailshaker.c; //////
        }
      }
    } else {
      if (cocktailshaker.id !== 0) {
        clearInterval(cocktailshaker.id);
        cocktailshaker.i = -1;
        cocktailshaker.c = -1;
        cocktailshaker.n = -1;
        cocktailshaker.id = 0;
        cocktailshaker.btn.innerHTML = SORT;
      }
    }
    requestAnimationFrame(cocktailshaker.Display);
  },
  Sort() {
    if (this.id === 0) {
      if (this.interval.value < 10 || this.interval.value > 1000) {
        this.interval.value = 10;
      }
      this.btn.innerHTML = STOP;
      this.id = setInterval(cocktailshaker.Sorting, this.interval.value);
    } else {
      clearInterval(this.id);
      this.id = 0;
      this.btn.innerHTML = SORT;
    }
  },
  Create() {
    this.array = document.getElementById("cocktailshaker-tot");
    this.canvas = document.getElementById("cocktailshaker");
    this.ctx = this.canvas.getContext("2d");
    this.btn = document.getElementById("cocktailshaker-btn");
    this.swaps = document.getElementById("cocktailshaker-swaps");
    this.interval = document.getElementById("cocktailshaker-interval");
    this.Input();
  },
};
var insertion = {
  buffer: [0],
  SwapSimple(i, j) {
    let elem = this.buffer[i];
    this.buffer[i] = this.buffer[j];
    this.buffer[j] = elem;
  },
  Swap(i, j) {
    this.SwapSimple(i, j);
    this.swapsNum++;
  },
  w: 0,
  h: 0,
  swapsNum: 0,
  DrawIndex: false,
  Display() {},
  DisplayColumns() {
    insertion.ctx.clearRect(0, 0, insertion.w, insertion.h);
    //insertion.ctx.fillStyle = '#ffffff'
    insertion.ctx.fillStyle = _Colors.Bg[0];
    insertion.ctx.fillRect(0, 0, insertion.w, insertion.h);
    insertion.ctx.font = insertion.bar.hp + "px Arial";
    for (var i = 0; i < insertion.buffer.length; i++) {
      //insertion.ctx.fillStyle = '#0000ff'
      insertion.ctx.fillStyle = _Colors.Cols[0];
      if (insertion.i === i) {
        //insertion.ctx.fillStyle = '#00ff00'
        insertion.ctx.fillStyle = _Colors.Cols[1];
      } else if (insertion.j === i) {
        //insertion.ctx.fillStyle = '#ff0000'
        insertion.ctx.fillStyle = _Colors.Cols[2];
      }
      insertion.ctx.fillRect(
        i * insertion.bar.wp,
        insertion.bar.hp * (insertion.buffer.length - insertion.buffer[i]),
        insertion.bar.wp,
        insertion.bar.hp * insertion.buffer[i]
      );
    }
    insertion.swaps.innerHTML = insertion.swapsNum + "<br />";
  },
  DisplayColumnsText() {
    insertion.ctx.clearRect(0, 0, insertion.w, insertion.h);
    //insertion.ctx.fillStyle = '#ffffff'
    insertion.ctx.fillStyle = _Colors.Bg[0];
    insertion.ctx.fillRect(0, 0, insertion.w, insertion.h);
    insertion.ctx.font = insertion.bar.hp + "px Arial";
    for (var i = 0; i < insertion.buffer.length; i++) {
      //insertion.ctx.fillStyle = '#0000ff'
      insertion.ctx.fillStyle = _Colors.Cols[0];
      if (insertion.i === i) {
        //insertion.ctx.fillStyle = '#00ff00'
        insertion.ctx.fillStyle = _Colors.Cols[1];
      } else if (insertion.j === i) {
        //insertion.ctx.fillStyle = '#ff0000'
        insertion.ctx.fillStyle = _Colors.Cols[2];
      }
      insertion.ctx.fillRect(
        i * insertion.bar.wp,
        insertion.bar.hp * (insertion.buffer.length - insertion.buffer[i]),
        insertion.bar.wp,
        insertion.bar.hp * insertion.buffer[i]
      );
      insertion.ctx.fillText(
        insertion.buffer[i],
        (i + 0.21) * insertion.bar.wp,
        insertion.bar.hp * (insertion.buffer.length - insertion.buffer[i] - 0.1)
      );
    }
    insertion.swaps.innerHTML = insertion.swapsNum + "<br />";
  },
  Shuffle(size) {
    while (this.buffer.length < size) {
      this.buffer.push(0);
    }
    for (var i = 0; i < this.buffer.length; i++) {
      this.buffer[i] = i;
    }
    for (var i = 0; i < this.buffer.length; i++) {
      this.SwapSimple(i, ran(this.buffer.length));
    }
  },
  Input() {
    this.w = this.canvas.width;
    this.h = (this.w * 2) / 3;
    this.canvas.height = this.h;
    var buff = this.array.value;
    this.swapsNum = 0;
    if (buff > 3) {
      this.buffer = [0];
      for (var i = 0; i < buff - 1; i++) {
        this.buffer.push(0);
      }
      this.Shuffle(this.buffer.length);
      this.bar = {
        wp: insertion.w / insertion.buffer.length,
        hp: insertion.h / insertion.buffer.length,
      };
      if (buff > 40) {
        this.DrawIndex = false;
        this.Display = this.DisplayColumns;
      } else {
        this.DrawText = true;
        this.Display = this.DisplayColumnsText;
      }
      //this.ctx.fillStyle = '#0000ff'
      this.ctx.fillStyle = _Colors.Cols[0];
      this.i = -1;
      this.j = -1;
      this.id = 0;
      this.Display();
      this.i = 1;
      this.j = 1;
    }
  },
  i: -1,
  j: -1,
  id: 0,
  Sorting() {
    if (insertion.i < insertion.buffer.length && insertion.id !== 0) {
      if (insertion.j >= 1) {
        if (insertion.buffer[insertion.j] < insertion.buffer[insertion.j - 1]) {
          insertion.Swap(insertion.j, insertion.j - 1);
          insertion.j--;
        } else {
          insertion.i++;
          insertion.j = insertion.i;
        }
      } else {
        insertion.i++;
        insertion.j = insertion.i;
      }
    } else {
      if (insertion.id !== 0) {
        clearInterval(insertion.id);
        insertion.i = -1;
        insertion.j = -1;
        insertion.id = 0;
        insertion.btn.innerHTML = SORT;
      }
    }
    requestAnimationFrame(insertion.Display);
  },
  Sort() {
    if (this.id === 0) {
      if (this.interval.value < 10 || this.interval.value > 1000) {
        this.interval.value = 10;
      }
      this.btn.innerHTML = STOP;
      this.id = setInterval(insertion.Sorting, this.interval.value);
    } else {
      clearInterval(this.id);
      this.id = 0;
      this.btn.innerHTML = SORT;
    }
  },
  Create() {
    this.array = document.getElementById("insertion-tot");
    this.canvas = document.getElementById("insertion");
    this.ctx = this.canvas.getContext("2d");
    this.btn = document.getElementById("insertion-btn");
    this.swaps = document.getElementById("insertion-swaps");
    this.interval = document.getElementById("insertion-interval");
    this.Input();
  },
};
var shell = {
  buffer: [0],
  SwapSimple(i, j) {
    let elem = this.buffer[i];
    this.buffer[i] = this.buffer[j];
    this.buffer[j] = elem;
  },
  w: 0,
  h: 0,
  shifts: 0,
  DrawIndex: false,
  Display() {},
  DisplayColumns() {
    shell.ctx.clearRect(0, 0, shell.w, shell.h);
    //shell.ctx.fillStyle = '#ffffff'
    shell.ctx.fillStyle = _Colors.Bg[0];
    shell.ctx.fillRect(0, 0, shell.w, shell.h);
    shell.ctx.font = shell.bar.hp + "px Arial";
    for (var i = 0; i < shell.buffer.length; i++) {
      ///shell.ctx.fillStyle = '#0000ff'
      shell.ctx.fillStyle = _Colors.Cols[0];
      if (shell.i === i) {
        //shell.ctx.fillStyle = '#00ff00'
        shell.ctx.fillStyle = _Colors.Cols[1];
      } else if (shell.gap === i) {
        //shell.ctx.fillStyle = '#ff0000'
        shell.ctx.fillStyle = _Colors.Cols[2];
      }
      shell.ctx.fillRect(i * shell.bar.wp, shell.bar.hp * (shell.buffer.length - shell.buffer[i]), shell.bar.wp, shell.bar.hp * shell.buffer[i]);
    }
    shell.swaps.innerHTML = shell.shifts + "<br />";
  },
  DisplayColumnsText() {
    shell.ctx.clearRect(0, 0, shell.w, shell.h);
    shell.ctx.font = shell.bar.hp + "px Arial";
    for (var i = 0; i < shell.buffer.length; i++) {
      //shell.ctx.fillStyle = '#0000ff'
      shell.ctx.fillStyle = _Colors.Cols[0];
      if (shell.i === i) {
        //shell.ctx.fillStyle = '#00ff00'
        shell.ctx.fillStyle = _Colors.Cols[1];
      } else if (shell.gap === i) {
        //shell.ctx.fillStyle = '#ff0000'
        shell.ctx.fillStyle = _Colors.Cols[2];
      }
      shell.ctx.fillRect(i * shell.bar.wp, shell.bar.hp * (shell.buffer.length - shell.buffer[i]), shell.bar.wp, shell.bar.hp * shell.buffer[i]);
      shell.ctx.fillText(shell.buffer[i], (i + 0.21) * shell.bar.wp, shell.bar.hp * (shell.buffer.length - shell.buffer[i] - 0.1));
    }
    shell.swaps.innerHTML = shell.shifts + "<br />";
  },
  Shuffle(size) {
    while (this.buffer.length < size) {
      this.buffer.push(0);
    }
    for (var i = 0; i < this.buffer.length; i++) {
      this.buffer[i] = i;
    }
    for (var i = 0; i < this.buffer.length; i++) {
      this.SwapSimple(i, ran(this.buffer.length));
    }
  },
  Input() {
    this.w = this.canvas.width;
    this.h = (this.w * 2) / 3;
    this.canvas.height = this.h;
    var buff = this.array.value;
    this.shifts = 0;
    if (buff > 3) {
      this.buffer = [0];
      for (var i = 0; i < buff - 1; i++) {
        this.buffer.push(0);
      }
      this.Shuffle(this.buffer.length);
      this.bar = {
        wp: shell.w / shell.buffer.length,
        hp: shell.h / shell.buffer.length,
      };
      if (buff > 40) {
        this.DrawIndex = false;
        this.Display = this.DisplayColumns;
      } else {
        this.DrawText = true;
        this.Display = this.DisplayColumnsText;
      }
      //this.ctx.fillStyle = '#0000ff'
      this.ctx.fillStyle = _Colors.Cols[0];
      this.i = -1;
      this.j = -1;
      this.id = 0;
      this.Display();
      this.gap = Math.floor(this.buffer.length / 2);
      this.i = this.gap;
      this.temp = this.buffer[this.i];
      this.j = this.i;
    }
  },
  i: -1,
  j: -1,
  gap: -1,
  temp: 0,
  id: 0,
  Sorting() {
    if (shell.gap > 0 && shell.id !== 0) {
      if (shell.i < shell.buffer.length) {
        shell.temp = shell.buffer[shell.i];
        for (shell.j = shell.i; shell.j >= shell.gap && shell.buffer[shell.j - shell.gap] > shell.temp; shell.j -= shell.gap) {
          shell.buffer[shell.j] = shell.buffer[shell.j - shell.gap];
          shell.shifts++;
        }
        shell.buffer[shell.j] = shell.temp;
        shell.shifts++;
        shell.i++;
      } else {
        shell.gap = Math.floor(shell.gap / 2);
        shell.i = shell.gap;
      }
    } else {
      if (shell.id !== 0) {
        clearInterval(shell.id);
        shell.i = -1;
        shell.gap = -1;
        shell.id = 0;
        shell.btn.innerHTML = SORT;
      }
    }
    requestAnimationFrame(shell.Display);
  },
  Sort() {
    if (this.id === 0) {
      if (this.interval.value < 10 || this.interval.value > 1000) {
        this.interval.value = 10;
      }
      this.btn.innerHTML = STOP;
      this.id = setInterval(shell.Sorting, this.interval.value);
    } else {
      clearInterval(this.id);
      this.id = 0;
      this.btn.innerHTML = SORT;
    }
  },
  Create() {
    this.array = document.getElementById("shell-tot");
    this.canvas = document.getElementById("shell");
    this.ctx = this.canvas.getContext("2d");
    this.btn = document.getElementById("shell-btn");
    this.swaps = document.getElementById("shell-swaps");
    this.interval = document.getElementById("shell-interval");
    this.Input();
  },
};
var oddeven = {
  buffer: [0],
  SwapSimple(i, j) {
    let elem = this.buffer[i];
    this.buffer[i] = this.buffer[j];
    this.buffer[j] = elem;
  },
  Swap(i, j) {
    this.SwapSimple(i, j);
    this.swapsNum++;
  },
  w: 0,
  h: 0,
  swapsNum: 0,
  DrawIndex: false,
  Display() {},
  DisplayColumns() {
    oddeven.ctx.clearRect(0, 0, oddeven.w, oddeven.h);
    //oddeven.ctx.fillStyle = '#ffffff'
    oddeven.ctx.fillStyle = _Colors.Bg[0];
    oddeven.ctx.fillRect(0, 0, oddeven.w, oddeven.h);
    oddeven.ctx.font = oddeven.bar.hp + "px Arial";
    for (var i = 0; i < oddeven.buffer.length; i++) {
      //oddeven.ctx.fillStyle = '#0000ff'
      oddeven.ctx.fillStyle = _Colors.Cols[0];
      if (oddeven.i === i) {
        //oddeven.ctx.fillStyle = '#00ff00'
        oddeven.ctx.fillStyle = _Colors.Cols[1];
      }
      oddeven.ctx.fillRect(
        i * oddeven.bar.wp,
        oddeven.bar.hp * (oddeven.buffer.length - oddeven.buffer[i]),
        oddeven.bar.wp,
        oddeven.bar.hp * oddeven.buffer[i]
      );
    }
    oddeven.swaps.innerHTML = oddeven.swapsNum + "<br />";
  },
  DisplayColumnsText() {
    oddeven.ctx.clearRect(0, 0, oddeven.w, oddeven.h);
    oddeven.ctx.font = oddeven.bar.hp + "px Arial";
    for (var i = 0; i < oddeven.buffer.length; i++) {
      //oddeven.ctx.fillStyle = '#0000ff'
      oddeven.ctx.fillStyle = _Colors.Cols[0];
      if (oddeven.i === i) {
        //oddeven.ctx.fillStyle = '#00ff00'
        oddeven.ctx.fillStyle = _Colors.Cols[1];
      }
      oddeven.ctx.fillRect(
        i * oddeven.bar.wp,
        oddeven.bar.hp * (oddeven.buffer.length - oddeven.buffer[i]),
        oddeven.bar.wp,
        oddeven.bar.hp * oddeven.buffer[i]
      );
      oddeven.ctx.fillText(oddeven.buffer[i], (i + 0.21) * oddeven.bar.wp, oddeven.bar.hp * (oddeven.buffer.length - oddeven.buffer[i] - 0.1));
    }
    oddeven.swaps.innerHTML = oddeven.swapsNum + "<br />";
  },
  Shuffle(size) {
    while (this.buffer.length < size) {
      this.buffer.push(0);
    }
    for (var i = 0; i < this.buffer.length; i++) {
      this.buffer[i] = i;
    }
    for (var i = 0; i < this.buffer.length; i++) {
      this.SwapSimple(i, ran(this.buffer.length));
    }
  },
  Input() {
    this.w = this.canvas.width;
    this.h = (this.w * 2) / 3;
    this.canvas.height = this.h;
    var buff = this.array.value;
    this.SwapsNums = 0;
    if (buff > 3) {
      this.buffer = [0];
      for (var i = 0; i < buff - 1; i++) {
        this.buffer.push(0);
      }
      this.Shuffle(this.buffer.length);
      this.bar = {
        wp: oddeven.w / oddeven.buffer.length,
        hp: oddeven.h / oddeven.buffer.length,
      };
      if (buff > 40) {
        this.DrawIndex = false;
        this.Display = this.DisplayColumns;
      } else {
        this.DrawText = true;
        this.Display = this.DisplayColumnsText;
      }
      //this.ctx.fillStyle = '#0000ff'
      this.ctx.fillStyle = _Colors.Cols[0];
      this.i = -1;
      this.j = 1;
      this.id = 0;
      this.Display();
      this.i = 0;
      this.sorted = false;
      this.sortkeep = true;
    }
  },
  i: -1,
  j: 0,
  sorted: false,
  sortkeep: false,
  id: 0,
  Sorting() {
    if (!oddeven.sorted && oddeven.id !== 0) {
      if (oddeven.i < oddeven.buffer.length - 1) {
        if (oddeven.buffer[oddeven.i] > oddeven.buffer[oddeven.i + 1]) {
          oddeven.Swap(oddeven.i, oddeven.i + 1);
          oddeven.sortkeep = false;
        }
        oddeven.i += 2;
      } else {
        oddeven.i = oddeven.j;
        oddeven.j = 1 - oddeven.j;
        if (oddeven.sortkeep) {
          oddeven.sorted = true;
        }
        oddeven.sortkeep = true;
      }
    } else {
      if (oddeven.id !== 0) {
        clearInterval(oddeven.id);
        oddeven.i = -1;
        oddeven.id = 0;
        oddeven.btn.innerHTML = SORT;
      }
    }
    requestAnimationFrame(oddeven.Display);
  },
  Sort() {
    if (this.id === 0) {
      if (this.interval.value < 10 || this.interval.value > 1000) {
        this.interval.value = 10;
      }
      this.btn.innerHTML = STOP;
      this.id = setInterval(oddeven.Sorting, this.interval.value);
      console.log("oddeven sort started with id: " + this.id);
    } else {
      clearInterval(this.id);
      this.id = 0;
      this.btn.innerHTML = SORT;
    }
  },
  Create() {
    this.array = document.getElementById("oddeven-tot");
    this.canvas = document.getElementById("oddeven");
    this.ctx = this.canvas.getContext("2d");
    this.btn = document.getElementById("oddeven-btn");
    this.swaps = document.getElementById("oddeven-swaps");
    this.interval = document.getElementById("oddeven-interval");
    this.Input();
  },
};
var merge = {
  buffer: [0],
  sleep() {
    return new Promise((resolve) => setTimeout(resolve, merge.interval.value));
  },

  SwapSimple(i, j) {
    let elem = this.buffer[i];
    this.buffer[i] = this.buffer[j];
    this.buffer[j] = elem;
  },
  async Swap(i, j) {
    await this.sleep();
    this.SwapSimple(i, j);
    this.swapsNum++;
  },
  w: 0,
  h: 0,
  swapsNum: 0,
  Display() {},
  DisplayColumns() {
    merge.check();
    merge.ctx.clearRect(0, 0, merge.w, merge.h);
    //merge.ctx.fillStyle = '#ffffff'
    merge.ctx.fillStyle = _Colors.Bg[0];
    merge.ctx.fillRect(0, 0, merge.w, merge.h);
    merge.ctx.font = merge.bar.hp + "px Arial";
    for (var i = 0; i < merge.buffer.length; i++) {
      //merge.ctx.fillStyle = '#0000ff'
      merge.ctx.fillStyle = _Colors.Cols[0];
      if (merge.m === i) {
        //merge.ctx.fillStyle = '#ff0000'
        merge.ctx.fillStyle = _Colors.Cols[1];
      }
      merge.ctx.fillRect(i * merge.bar.wp, merge.bar.hp * (merge.buffer.length - merge.buffer[i]), merge.bar.wp, merge.bar.hp * merge.buffer[i]);
    }
    merge.swaps.innerHTML = merge.swapsNum + "<br />";
    if (merge.order) return;
    requestAnimationFrame(merge.DisplayColumns);
  },
  DisplayColumnsText() {
    merge.check();
    merge.ctx.clearRect(0, 0, merge.w, merge.h);
    //merge.ctx.fillStyle = '#ffffff'
    merge.ctx.fillStyle = _Colors.Bg[0];
    merge.ctx.fillRect(0, 0, merge.w, merge.h);
    merge.ctx.font = merge.bar.hp + "px Arial";
    for (var i = 0; i < merge.buffer.length; i++) {
      //merge.ctx.fillStyle = '#0000ff'
      merge.ctx.fillStyle = _Colors.Cols[0];
      if (merge.m === i) {
        //merge.ctx.fillStyle = '#ff0000'
        merge.ctx.fillStyle = _Colors.Cols[1];
      }
      merge.ctx.fillRect(i * merge.bar.wp, merge.bar.hp * (merge.buffer.length - merge.buffer[i]), merge.bar.wp, merge.bar.hp * merge.buffer[i]);
      merge.ctx.fillText(merge.buffer[i], (i + 0.21) * merge.bar.wp, merge.bar.hp * (merge.buffer.length - merge.buffer[i] - 0.1));
    }
    merge.swaps.innerHTML = merge.swapsNum + "<br />";
    if (merge.order) return;
    requestAnimationFrame(merge.DisplayColumnsText);
  },
  Shuffle(size) {
    while (this.buffer.length < size) {
      this.buffer.push(0);
    }
    for (var i = 0; i < this.buffer.length; i++) {
      this.buffer[i] = i;
    }
    for (var i = 0; i < this.buffer.length; i++) {
      this.SwapSimple(i, ran(this.buffer.length));
    }
  },
  Input() {
    this.w = this.canvas.width;
    this.h = (this.w * 2) / 3;
    this.canvas.height = this.h;
    var buff = this.array.value;
    this.swapsNum = 0;
    if (buff > 3) {
      this.buffer = [0];
      for (var i = 0; i < buff - 1; i++) {
        this.buffer.push(0);
      }
      this.Shuffle(this.buffer.length);
      this.bar = {
        wp: this.w / this.buffer.length,
        hp: this.h / this.buffer.length,
      };
      if (buff > 40) {
        this.DrawIndex = false;
        this.Display = this.DisplayColumns;
      } else {
        this.DrawText = true;
        this.Display = this.DisplayColumnsText;
      }
      //this.ctx.fillStyle = '#0000ff'
      this.ctx.fillStyle = _Colors.Cols[0];
      this.m = -1;
      this.id = 0;
      this.order = false;
      this.Display();
    }
  },
  id: 0,
  order: false,
  checkcount: 0,
  m: 0,
  check() {
    let order = true;
    for (var i = 1; i < merge.buffer.length; i++) if (merge.buffer[i] < merge.buffer[i - 1]) order = false;
    if (order) {
      merge.m = -1;
    }
    merge.order = order;
  },
  /**
   *
   * @param {number[]} arr
   * @param {number} a
   * @param {number} b
   * @param {number} c
   */
  async Merge(arr, a, b, c) {
    let n1 = b - a + 1;
    let n2 = c - b;
    let L = new Array(n1),
      R = new Array(n2);
    for (let i = 0; i < n1; i++) L[i] = arr[a + i];
    for (let j = 0; j < n2; j++) R[j] = arr[b + 1 + j];
    let i = 0;
    let j = 0;
    let k = a;
    while (i < n1 && j < n2) {
      if (L[i] <= R[j]) {
        arr[k] = L[i];
        i++;
      } else {
        arr[k] = R[j];
        j++;
      }
      k++;
      merge.swapsNum++;
    }
    while (i < n1) {
      arr[k] = L[i];
      i++;
      k++;
      merge.swapsNum++;
    }
    while (j < n2) {
      arr[k] = R[j];
      j++;
      k++;
      merge.swapsNum++;
    }
  },
  /**
   *
   * @param {number[]} arr
   * @param {number} l
   * @param {number} h
   */
  async Sorting(arr, l, h) {
    if (l < h) {
      let p = Math.floor((h + l) / 2);
      merge.m = p;
      await merge.sleep();
      await merge.Sorting(arr, l, p);
      await merge.Sorting(arr, p + 1, h);
      await merge.Merge(arr, l, p, h);
    }
  },
  Sort() {
    if (!this.order) {
      if (this.interval.value < 10 || this.interval.value > 10000) {
        this.interval.value = 10;
      }
      this.swapsNum = 0;
      this.swaps.innerHTML = "0";
      this.Sorting(this.buffer, 0, this.buffer.length - 1);
      this.id = requestAnimationFrame(this.Display);
    } else {
      this.l = -1;
      this.p = -1;
    }
  },
  Create() {
    this.array = document.getElementById("merge-tot");
    this.canvas = document.getElementById("merge");
    this.ctx = this.canvas.getContext("2d");
    this.btn = document.getElementById("merge-btn");
    this.swaps = document.getElementById("merge-swaps");
    this.interval = document.getElementById("merge-interval");
    this.Input();
  },
};
bubble.Create();
selection.Create();
quick.Create();
cocktailshaker.Create();
insertion.Create();
shell.Create();
oddeven.Create();
merge.Create();
