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

Already in ancient times there was a need to calculate the circumferences and areas of circles. However, the procedure is not so easy, since 𝜋 is transcendental and irrational.
For this reason, today as in the past, we must resort to approximations, always trying to improve our precision in doing so.

The first mathematician to find a procedure to approach 𝜋 was the Syracusan (of Greek-Carthaginian origin) Archimedes. After him, humanity had to wait until the end of the Middle Ages to see further progress in this research: James Gregory and Gottfried Leibniz developed the procedure that was used until the last century. At the same time, Isaac Newton also developed a similar procedure.
However, it was Srinivasa Ramanujan who found the most efficient (in terms of computability) formula to approximate 𝜋, a formula that is still used today, with slight modifications.

There are also methodologies that have been known for years but never used due to their low speed or precision: the first is a simulation of elastic collisions between two particular bodies, and therefore requires many calculations, although it does not make errors; the second uses random numbers, which are not really obtainable in reality.

## Archimede's method

The first to try to approximate this value was Archimedes in Syracuse, in 250 BC.
He noticed that, by inscribing a regular polygon with more and more sides inside a circle of radius 0.5, its perimeter got closer and closer to 𝜋, in this case the value of the circumference.
Some even say that Archimedes was killed by a Roman soldier because he refused to stop working on his "circles".

<img src="/assets/img/archimedes_death.jpg" title="Archimede's death" 
    style="margin-inline: auto; width: 100%; max-width: 500px;">

$$ \pi = N sin{180° \over N} $$

<div class="row">
    <div class="col col-4">
        <div class="row">
            <div class="col mb-3">
                <div class="input-group">
                    <span class="input-group-text">N = </span>
                    <input type="number" 
                        min="3" max="99999" step="1"
                        value="10" id="archimedes-input" size="5"
                        class="form-control">
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <span class="italic">𝜋 = </span>
                <output id="archimedes-receive"></output>
            </div>
        </div>
    </div>
    <div class="col col-8">
        <canvas id="archimedes-canvas" 
            width="1000" height="1000" 
            style="margin-inline: auto; max-height: 350px;"></canvas>
    </div>
</div>

Archimedes, however, did not have the "sine" and therefore resorted to a simplified version of this formula:
starting from _N_ = 6, he doubled the number of sides over and over again, until he reached _N_ = 96.

To do this, it is necessary to be able to calculate the side of a rectangular polygon of _2N_ sides, simply by knowing the measure of the one with _N_ sides.

<img src="/assets/img/archimede-method.svg" title="Archimede's method" 
    style="margin-inline: auto; width: 100%; max-width: 500px;">

Simply with the pythagorean theorem we obtain _h_, and from it _L'_

$$ h = r - \sqrt{r^2 - {L^2 \over 4}} $$

$$ {L'}^2 = 2rh \rightarrow {L'}^2 = 2r^2 - 2r\sqrt{r^2 - {L^2 \over 4}} $$

$$ L' = \sqrt{2r^2 - 2r\sqrt{r^2 - {L^2 \over 4}}} $$

$$ \pi \approx N \times L' = N\sqrt{2r^2 - 2r\sqrt{r^2 - {L^2 \over 4}}} $$

Starting from the hexagon it is simple, since _L_ = _r_

<div class="row">
    <div class="col col-4">
        <div class="row">
            <div class="col mb-3">
                <div class="input-group">
                    <span class="input-group-text">N = </span>
                    <select id="archimedes-input-2" class="form-control">
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
            </div>            
        </div>
        <div class="row">
            <div class="col">
                <span class="italic">𝜋 = </span>
                <output id="archimedes-receive-2"></output>
            </div>
        </div>
    </div>
    <div class="col col-8">
        <canvas id="archimedes-canvas-2" 
            width="1000" height="1000" 
            style="margin-inline: auto; max-height: 350px;"></canvas>
    </div>
</div>

By using this procedure up to _N_ = 96, repeating it not only by inscribing but also by circumscribing the polygons, the Sicilian managed to arrive at

$$ {223 \over 71} < \pi < {22 \over 7} $$

It is worth noting that the mathematician did not have a modern method for calculating square roots and was thus forced to use only approximate techniques.

## Madhava-Gregory-Leibniz's series

In 1668, Scottish mathematician and astronomer James Gregory devised an infinite series to approximate the inverse of tangents.

$$ 
tan^{-1}{x} = \sum_{K=0}^\infty { {(-1)^K x^{2K+1} } \over {2K+1} } = x - {x^3 \over 3} + {x^5 \over 5} - {x^7 \over 7} + {x^9 \over 9} - {x^{11} \over 11} + ... 
$$

Gottfried Leibniz, a few years later, imposed x = 1 and thus obtained:

$$ {\pi \over 4} = \sum_{K=0}^\infty { { (-1)^K } \over {2K+1} } = 1 - {1 \over 3} + {1 \over 5} - {1 \over 7} + {1 \over 9} - {1 \over 11} + ... 
$$

To approximate 𝜋 it will be possible to insert a very large value of _N_ into the following formula:

$$ \pi \approx 4 \sum_{K=0}^N { { (-1)^K } \over {2K+1} } $$

<div class="row">
    <div class="col">
        <div class="input-group">
            <span class="input-group-text">N = </span>
            <input type="number" 
                min="4" max="1000000" step="1"
                value="1000" id="leibniz-input" size="10"
                class="form-control">
        </div> 
    </div>
    <div class="col">
        <span class="italic">𝜋 = </span>
        <output id="leibniz-receive">3.14</output>
    </div>
</div>

These two series are easily proved by the work of another Indian mathematician of two centuries earlier, Madhava of Sangamagrama, who first derived the way to approximate an angle from its tangent:

$$ 
\theta = \sum_{N=0}^\infty { {(-1)^N tan^{2N+1}{\theta} } \over {2N+1} } = tan{\theta} - {tan^3{\theta} \over 3} + {tan^5{\theta} \over 5} - {tan^7{\theta} \over 7} + ... 
$$

By setting $ θ = 𝜋 / 4 $, we arrive at Leibniz's formula.

### Implementation

```js
async function Leibniz(n) {
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

Srinivasa Ramanujan, an Indian mathematician, in 1910 arrived at this series which converges in the reciprocal of 𝜋:

$$ {1 \over \pi} = { {2 \sqrt{ 2 }} \over 9801}\sum_{k=0}^\infty { { (4k)! (1103 + 26390k)} \over { (k!)^4 396^{4k}} } $$

This series was the basis for the "fast algorithms" for computing 𝜋, in particular this formula was taken up and modified in 1988 by the Chudnovsky brothers who wrote:

$$ {1 \over \pi} = 12\sum_{k=0}^\infty { { (-1)^k (6k)! (13591409 + 545140134k)} \over { (3k)! (k!)^3 (640320)^{3(k+1/2)} } } $$

Later simplified to:

$$ {128096012 \over {3\pi}} = \sum_{k=0}^\infty { { (6k)! (13591409 + 545140134k)} \over { (3k)! (k!)^3 (-2625374112640768000)^k } } $$

Each term of the sum is very complex to calculate but the convergence to 𝜋 is very fast: with just 2 iterations you can correctly obtain 9 decimal places.

<div class="row">
    <div class="col">
        <div class="input-group">
            <span class="input-group-text">k = </span>
            <input type="number" 
                min="2" max="256" step="1"
                value="4" id="ramanujan-input" size="10"
                class="form-control">
        </div> 
    </div>
    <div class="col">
        <span class="italic">𝜋 = </span>
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

It seems absurd but this simulation of elastic collisions manages to calculate Pi!

Both blocks perform elastic collisions with each other and the left block bounces without losing energy when it hits the wall.
The masses of the blocks are not random: the small block has a mass of unit while the other has a mass that is a multiple of 100.

Almost magically the number of collisions that the small block performs approximates 𝜋.

[Watch the explaination on Youtube](https://www.youtube.com/watch?v=jsYwFizhncE "Watch on YouTube")

The exponential complexity of the algorithm makes it terrible for computation times: for this reason it has never really been used to calculate digits of 𝜋 unknown to us.

It is still fun to simulate and watch.

<div class="row">
    <div class="col">
        <div class="row">
            <div class="col mb-3">
                <label for="collision-input" class="form-label">
                    Digits
                </label>
                <input type="number" 
                    id="collision-input" class="form-control"
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
                    𝜋 =
                </span>
                <output id="collision-receive">0</output>
            </div>
        </div>
    </div>
    <div class="col col-9">
        <canvas id="collision-canvas" width="600" height="300" style="width: 100%; margin-inline: auto; max-height: 350px;"></canvas>
    </div>
</div>

## Montecarlo's method

Taking a quarter of a circumference inscribed in a square, we have that the ratio between the areas is

$$ { { {\pi r^2} \over 4 } \over {r^2}} = { {\pi r^2} \over {4 r^2}} = { \pi \over 4} $$

By drawing a significant amount of points, the ratio between the number of points inside the quarter of the circle and the total number of points should be approximately the same as that of the areas.

$$ {N_{Internals} \over N_{Total}} \approx { \pi \over 4} $$

Because it uses randomly drawn numbers, this method is also called the Monte Carlo Method.

<div class="row">
    <div class="col">
        <div class="row">
            <div class="col mb-3">
                <label for="random-function-select" class="form-label">
                    Random generator
                </label>
                <select id="random-function-select" class="form-control">
                    <option value="default">Browser built in</option>
                    <option value="decimalJS">From Decimal.js library</option>
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
                <span>𝜋 = </span>
                <output id="random-receive" class="receive">3.14</output>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <span>Number of points: </span>
                <span id="random-total" class="receive">0</span>
            </div>
        </div>
    </div>
    <div class="col col-8">
        <canvas 
            id="random-canvas-1" 
            width="1000" height="1000" 
            style="margin-inline: auto; max-height: 300px; border: 1px solid;"></canvas>
    </div>
</div>

The use of randomly generated numbers unfortunately makes the values ​​found not very reliable, as it is not possible to generate a number in a completely unconditional way. However, these "extractions" can be an indication of how good the algorithm that returns pseudo-random numbers is.