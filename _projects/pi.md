---
layout: page
title: Calculate 𝜋 in the browser
description: >
  Play with different method of approximation of 𝜋
img: assets/img/pi-cover.svg
importance: 2
category: education
---

<script defer src="https://cdnjs.cloudflare.com/ajax/libs/decimal.js/9.0.0/decimal.min.js"></script>
<script defer src="{{ '/assets/js/projects/async-tools.js' | relative_url }}"></script>
<script defer src="{{ '/assets/js/projects/pi.js' | relative_url }}"></script>

First, for this demo, we're going to need two helper functions to ease calculations and
better display the results. This is beacuse most of the code we're going to run will be asynchornous.

```js
async function RunParallel(arrayofFunctions) {
    if (!arrayofFunctions)
        return;
    const arrayOfPromises = arrayofFunctions.filter(f => typeof f === 'function').map(
        (f, i, all) => new Promise((res, rej) => {
            try {
                res(f());
            } catch (err) {
                rej(err);
            }
        })
    );
    return await Promise.all(arrayOfPromises);
}
async function delay(time) {
    if (!time || isNaN(time))
        return;
    return await new Promise(resolve => setTimeout(resolve, time));
}
```

We'll also use the [DecimalJS](https://mikemcl.github.io/decimal.js/) library and 
these other functions for basic operations.

```js
function factorial(num) {
  var n = new Decimal(1);
  if (num < 2) return n;
  for (var k = 2; k <= num; n = n.times(k++)) {}
  return n;
}
function gcd(a, b) {
  let c = a.minus(b);
  while (c.comparedTo(0) !== 0) {
    if (c.isPositive()) {
      a = a.dividedBy(c);
    } else {
      b = b.dividedBy(c.negated());
    }
    c = a.minus(b);
  }
  return a;
}
function CoPrime(a, b) {
  return gcd(a, b).equals(1);
}
```

## Archimede's method

![The death of Archomede](/assets/img/archimedes_death.jpg "Archimede's death")

$$ \pi = N sin{180° \over N} $$

<div class="row">
    <div class="col">
        <div class="row">
            <div class="col mb-3">
            <label for="archimedes-input"
                    class="italic">N = </label>
            <input type="number" min="3" max="99999" value="10"
                    id="archimedes-input" size="5" step="1">
            </div>
        </div>
        <div class="row">
            <div class="col">
                <span class="italic">Pi = </span>
                <output id="archimedes-receive"></output>
            </div>
        </div>
    </div>
    <div class="col">
        <canvas id="archimedes-canvas" width="1000" height="1000" style="margin-inline: auto; max-height: 350px;"></canvas>
    </div>
</div>

![Archimede method](/assets/img/archimede-method.svg)

$$ h = r - \sqrt{r^2 - {L^2 \over 4}} $$

$$ {L'}^2 = 2rh \rightarrow {L'}^2 = 2r^2 - 2r\sqrt{r^2 - {L^2 \over 4}} $$

$$ L' = \sqrt{2r^2 - 2r\sqrt{r^2 - {L^2 \over 4}}} $$

$$ \pi \approx N \times L' = N\sqrt{2r^2 - 2r\sqrt{r^2 - {L^2 \over 4}}} $$

<div class="row">
    <div class="col">
        <div class="row">
            <label for="archimedes-input-2"
                    class="italic">N = </label>
            <select id="archimedes-input-2">
                <option value="6">6</option>
                <option value="12">12</option>
                <option value="24">24</option>
                <option value="48">48</option>
                <option value="96">96</option>
                <option value="192">192</option>
                <option value="384">384</option>
                <option value="768">768</option>
                <option value="1536">1536</option>
                <option value="3072">3072</option>
            </select>
        </div>
        <div class="row">
            <div class="col">
                <span class="italic">Pi = </span>
                <output id="archimedes-receive-2"></output>
            </div>
        </div>
    </div>
    <div class="col">
        <canvas id="archimedes-canvas-2" width="1000" height="1000" style="margin-inline: auto; max-height: 350px;"></canvas>
    </div>
</div>

## Madhava-Gregory-Leibniz's series

$$ tan^{-1}{x} = \sum\limits\_{K=0}^\infty { {(-1)^K x^{2K+1} } \over {2K+1} } = x - {x^3 \over 3} + {x^5 \over 5} - {x^7 \over 7} + {x^9 \over 9} - {x^{11} \over 11} + ... $$

$$ {\pi \over 4} = \sum\limits\_{K=0}^\infty { { (-1)^K } \over {2K+1} } = 1 - {1 \over 3} + {1 \over 5} - {1 \over 7} + {1 \over 9} - {1 \over 11} + ... $$

$$ \pi \approx 4\sum\limits\_{K=0}^N { { (-1)^K } \over {2K+1} } $$

<div class="row">
    <div class="col">
        <span class="italic">N = </span>
        <input type="number" min="4" max="1000000"
                value="1000" id="leibniz-input" size="10" step="1">
    </div>
</div>
<div class="row">
    <div class="col">
        <span class="italic">Pi = </span>
        <output id="leibniz-receive">3.14</output>
    </div>
</div>

$$ \theta = \sum\limits\_{N=0}^\infty { {(-1)^N tan^{2N+1}{\theta} } \over {2N+1} } = tan{\theta} - {tan^3{\theta} \over 3} + {tan^5{\theta} \over 5} - {tan^7{\theta} \over 7} + ... $$

### Implementation

```js
async function LeibnizIterateUntil(n) {
    let p = new Decimal(1);
    const One = new Decimal(1); // Used to not generate n uneeded instances
    let even = false;
    for (let k = 1; k <= n; k++) {
        const t = One.dividevBy(2 * k + 1);
        if (even) {
            p = p.plut(t); // 2,4,6,...
        } else {
            p = p.minus(t);// 1,3,5
        }
        even = !even;
    }
    return p.times(4);
}
```

## Ramanujan's formula

$$ {1 \over \pi} = { {2 \sqrt{ 2 }} \over 9801}\sum\limits\_{k=0}^\infty { { (4k)! (1103 + 26390k)} \over { (k!)^4 396^{4k}} } $$

$$ {1 \over \pi} = 12\sum\limits\_{k=0}^\infty { { (-1)^k (6k)! (13591409 + 545140134k)} \over { (3k)! (k!)^3 (640320)^{3(k+1/2)} } } $$

$$ {128096012 \over {3\pi}} = \sum\limits\_{k=0}^\infty { { (6k)! (13591409 + 545140134k)} \over { (3k)! (k!)^3 (-2625374112640768000)^k } } $$

<div class="row">
    <div class="col">
        <span class="italic">k = </span>
        <input 
            type="number" min="2" max="256"
            value="32" id="ramanujan-input" size="10" step="1">
    </div>
</div>
<div class="row">
    <div class="col">
        <span class="italic">Pi = </span>
        <output id="ramanujan-receive">3.140592653839794</output>
    </div>
</div>

### Implementation

```js
async function Ramanujan(n) {
    const oldP = Decimal.precision;
    Decimal.set({ precision: 5 * n }); // We're gonna need a lot of precision

    // Since the operation is quite resource expensive, 
    // calculations will be splitted in two blocks (that will later be summed).
    // This will result in a slight performance loss (JS is single-threaded)
    // but will prevent the browser UI from freezing
    const pivot = Math.floor(n / 2);
    let blocks = await RunParallel([() => RamanujanIteration(0, pivot), () => RamanujanIteration(pivot, n)]);
    const C = Decimal(1).div(Decimal(426880).times(Decimal(10005).sqrt())); // Constant we will divide the results by
    let p = Decimal(1).div(C.times(blocks[0].plus(blocks[1])));
    
    Decimal.set({ precision: oldP }); // Restore the initial precision
    return p;
}

function RamanujanIteration(start, end) {
    let p = new Decimal(0);
    for (var k = start; k < end; k++) {
        const Mk = Decimal(factorial(6 * k)).div(Decimal(factorial(3 * k)).times(Decimal(factorial(k)).pow(3)));
        const Lk = Decimal(545140134).times(k).plus(13591409);
        const Xk = Decimal(-262537412640768000).pow(k);
        p = p.plus(Mk.times(Lk).div(Xk));
    }
    return p;
}
```

## The collisions method

[Watch on Youtube <i class="fa fa-youtube-play"></i>](https://www.youtube.com/watch?v=jsYwFizhncE "Watch on YouTube")

<div class="row">
    <div class="col">
        <div class="row">
            <div class="col mb-3">
                <label for="collision-input">
                    Cifre:
                </label>
                <input type="number" id="collision-input"
                    min="2" value="4" max="7" step="1" />
            </div>
        </div>
        <div class="row">
            <div class="col mb-3">
                <button type="button" id="collision-start" class="btn btn-primary">
                    Start
                </button>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <span>
                    Pi =
                </span>
                <output id="collision-receive">0</output>
            </div>
        </div>
    </div>
    <div class="col">
        <canvas id="collision-canvas" width="600" height="300" style="width: 100%; margin-inline: auto; max-height: 350px;"></canvas>
    </div>
</div>

## Montecarlo's method

$$ { { {\pi r^2} \over 4 } \over {r^2}} = { {\pi r^2} \over {4 r^2}} = { \pi \over 4} $$

$$ {N*{Interni} \over N*{Esterni}} \approx { \pi \over 4} $$

<div class="col">
    <div class="row">
        <div class="col mb-3">
            <label for="random-function-select">
                Generatore di numeri impiegato:
            </label>
            <select id="random-function-select">
                <option value="default">Predefinito del browser</option>
                <option value="decimalJS">Da libreria DecimalJS</option>
            </select>
        </div>
    </div>
    <div class="row">
        <div class="col mb-3">
            <button type="button" class="btn btn-primary" id="random-input">
                Start
            </button>
        </div>
        <div class="col mb-3">
            <button type="button" class="btn btn-primary" id="random-reset">
                Reset
            </button>
        </div>
    </div>
    <div class="row">
        <div class="col">
            <span>Pi = </span>
            <output id="random-receive" class="receive">3.14</output>
        </div>
    </div>
    <div class="row">
        <div class="col">
            <span>Number of points: </span>
            <span id="random-total" class="receive">0</span>
        </div>
    </div>
    <div class="row">
        <div class="col">
            <canvas id="random-canvas-1" width="1000" height="1000" style="margin-inline: auto; max-height: 300px;"></canvas>
        </div>
    </div>
</div>
