---
layout: post
tags: [math, numerical-methods, probability, computer-science, javascript, demo-avaible]
title: Calculating 𝜋 in the browser
description: >
  Explore pi through polygon bounds, infinite series, elastic collisions, and random sampling, with interactive demonstrations of how each method converges.
thumbnail: assets/img/pi/cover.svg
date: 2024-03-14
last_modified_at: 2026-11-13
math: true
toc:
  beginning: true
---

<script defer src="{{ '/assets/js/projects/pi.js' | relative_url }}" data-worker-url="{{ '/assets/js/projects/pi-worker.js' | relative_url }}"></script>

A circle, an infinite sum, two colliding blocks, and a cloud of random points seem to have little in common.
Yet each can lead us to the same number: **𝜋**.
In this article, I'll use browser experiments to connect these methods and show why some gain accurate digits much faster than others.

I suggest starting with the polygon demo, where we can see the geometry directly, then comparing the slow alternating series with the rapidly converging formulas.
The last two demos approach 𝜋 through mechanics and probability.
Their purpose is to make the ideas visible, rather than to compete with specialized software for computing digits.

## What are we calculating?

For a circle of circumference $$C$$ and radius $$r$$, we define

$$
\pi=\frac{C}{2r}.
$$

The same constant appears in its area, $$A=\pi r^2$$, and in many formulas involving waves, probability, and complex numbers.
Changing the circle's size changes its circumference and diameter by the same factor, leaving their ratio unchanged.

<div class="pi-reference" aria-label="Pi to 50 decimal places">𝜋 = 3.14159265358979323846264338327950288419716939937510…</div>

𝜋 is **irrational**, so it cannot be written as a ratio of two integers, and its decimal expansion neither terminates nor eventually repeats.
It is also **transcendental**: it is not a root of any nonzero polynomial with integer coefficients.
These facts do not prevent us from defining 𝜋 exactly or writing exact formulas for it.
They mean that a finite decimal display is always an approximation.

There are two different sources of numerical error to watch for here.
**Truncation error** comes from stopping a polygon construction or an infinite sum after finitely many steps.
**Rounding error** comes from storing and manipulating numbers with finite precision.
Increasing the number of displayed digits addresses neither problem by itself.

## A short history, without the long gaps

Approximations to 𝜋 existed long before Archimedes.
Progress also continued between ancient Greece and seventeenth-century Europe, notably in Chinese and Indian mathematics.
The following milestones give some context for the methods we'll try.

| Period | Development |
| --- | --- |
| Ancient Egypt and Mesopotamia | Practical approximations supported calculations involving circles. |
| Third century BCE | Archimedes bounded 𝜋 using inscribed and circumscribed polygons. |
| Fifth century CE | Zu Chongzhi obtained the remarkably accurate fraction $$355/113$$. |
| Around 1400 | Madhava and the Kerala tradition developed series related to the arctangent, centuries before their European rediscovery. |
| Seventeenth century | Gregory and Leibniz independently developed the arctangent-series approach in Europe. |
| Eighteenth and nineteenth centuries | Proofs of irrationality and transcendence clarified what kinds of exact representations are impossible. |
| 1914 | Ramanujan published strikingly fast series for $$1/\pi$$. |
| Late 1980s | The Chudnovsky brothers developed another extremely fast series. |
| 2003 | Galperin published a method for extracting digits by counting elastic collisions. |

For the historical background, I recommend MacTutor's [history of 𝜋](https://mathshistory.st-andrews.ac.uk/HistTopics/Pi_through_the_ages/) and its [chronology of approximations](https://mathshistory.st-andrews.ac.uk/HistTopics/Pi_chronology/).
We'll return to the original papers and computational references as each method appears.

## 1. Archimedes: trapping a circle between polygons

A regular polygon inscribed in a circle has a smaller perimeter than the circle.
A regular polygon circumscribed around it has a larger perimeter.
Dividing those perimeters by the circle's diameter gives a lower and an upper bound for 𝜋.
As the number of sides increases, the two bounds approach one another.

For a unit circle and an $$n$$-sided polygon, modern trigonometry writes the bounds as

$$
n\sin\left(\frac{\pi}{n}\right)<\pi<n\tan\left(\frac{\pi}{n}\right).
$$

The angles here are in **radians**.
These formulas describe the geometry neatly, but plugging a known value of 𝜋 into sine would not independently calculate 𝜋.
The demo instead starts from a regular hexagon and doubles its sides using square roots.

Let $$q_n$$ be the side length of an inscribed polygon in a circle of radius one.
A regular hexagon has $$q_6=1$$.
Bisecting one of its central triangles and applying the Pythagorean theorem gives

$$
q_{2n}=\sqrt{2-\sqrt{4-q_n^2}}.
$$

When $$q_n$$ is small, the subtraction loses significant digits in floating-point arithmetic.
Rationalizing the expression gives the more stable form used by the demo:

$$
q_{2n}=\frac{q_n}{\sqrt{2+\sqrt{4-q_n^2}}}.
$$

The corresponding perimeter ratios are

$$
L_n=\frac{nq_n}{2},\qquad
U_n=\frac{nq_n}{\sqrt{4-q_n^2}},\qquad
L_n<\pi<U_n.
$$

{% include pi-demo.liquid method='polygon' title='Squeeze the circle' description='Double the number of sides and watch the gap between the two approximations shrink.' %}

At 96 sides, the demo gives approximately $$3.14103195<\pi<3.14271460$$.
Archimedes used rational estimates of square roots to obtain the famous, slightly wider bounds

$$
\frac{223}{71}<\pi<\frac{22}{7}.
$$

Notice that $$22/7$$ is an upper bound, rather than an exact value of 𝜋.
The demo follows the geometric idea using modern floating-point arithmetic; its displayed endpoints are rounded approximations, not certified interval-arithmetic results.
`Math.PI` is used to draw the polygons, but not in the recurrence that computes their perimeter ratios.

Asymptotically, the geometric errors shrink like $$1/n^2$$:

$$
\pi-L_n\sim\frac{\pi^3}{6n^2},\qquad
U_n-\pi\sim\frac{\pi^3}{3n^2}.
$$

Doubling the number of sides therefore reduces the error by roughly a factor of four once the polygons are sufficiently fine.

<details markdown="1">
<summary>A compact implementation of the stable recurrence</summary>

```js
function polygonBounds(sides) {
  let n = 6, chord = 1;
  while (n < sides) {
    chord /= Math.sqrt(2 + Math.sqrt(4 - chord * chord));
    n *= 2;
  }
  return {
    lower: n * chord / 2,
    upper: n * chord / Math.sqrt(4 - chord * chord)
  };
}
```

Here, `sides` must be one of `6, 12, 24, …`, as enforced by the selector.

</details>

## 2. The Madhava-Gregory-Leibniz series

The derivative of $$\arctan x$$ is $$1/(1+x^2)$$.
Expanding this denominator as a geometric series and integrating gives

$$
\arctan x=\sum_{k=0}^{\infty}\frac{(-1)^k x^{2k+1}}{2k+1}.
$$

The power series converges for $$|x|<1$$ and also converges at the endpoints $$x=\pm1$$.
Since $$\arctan1=\pi/4$$, we obtain

$$
\pi=4\left(1-\frac13+\frac15-\frac17+\cdots\right).
$$

This result is associated with Madhava, Gregory, and Leibniz because of its development in different mathematical traditions.
The [NIST Digital Library of Mathematical Functions](https://dlmf.nist.gov/4.45) discusses the arctangent series and why reducing the argument improves computation.

We'll define $$N$$ as the **number of terms**, so the finite sum ends at $$k=N-1$$:

$$
\pi_N=4\sum_{k=0}^{N-1}\frac{(-1)^k}{2k+1}.
$$

Because the terms alternate and decrease in magnitude, the first omitted term bounds the truncation error:

$$
|\pi-\pi_N|\leq\frac{4}{2N+1}.
$$

Odd values of $$N$$ give an overestimate; even values give an underestimate.
At 1,000 terms, the bound is still about $$0.002$$.
This is a beautifully simple formula, but a slow way to obtain many digits.

{% include pi-demo.liquid method='leibniz' title='Watch a slow series converge' description='Increase the term count and compare the result with the first-omitted-term error bound.' maximum='1000000' initial='1000' %}

The bound assumes exact arithmetic.
The implementation uses compensated summation to reduce floating-point accumulation error, but the displayed error bound does not certify the separate rounding error.
The distinction becomes important when comparing a mathematical convergence theorem with a finite-precision program.

## 3. Ramanujan: many digits from very few terms

Ramanujan's 1914 paper, [“Modular equations and approximations to 𝜋”](https://ramanujan.sirinudi.org/Volumes/published/ram06.html), contains a much faster series:

$$
\frac1\pi=\frac{2\sqrt2}{9801}
\sum_{k=0}^{\infty}
\frac{(4k)!\,(1103+26390k)}{(k!)^4\,396^{4k}}.
$$

The large power in the denominator makes successive contributions shrink rapidly.
Each additional term typically contributes roughly eight more decimal digits of accuracy.
That is a radically different behavior from adding reciprocals of successive odd integers.

For $$N$$ terms, we first calculate the partial sum $$S_N$$, then invert the result:

$$
\pi_N=\frac{9801}{2\sqrt2\,S_N}.
$$

{% include pi-demo.liquid method='ramanujan' title="Try Ramanujan's original series" description='Compare one, two, and three terms before increasing the count further.' maximum='20' initial='1' %}

A single term gives approximately $$3.1415927300$$.
It is already close, but the displayed trailing digits are not all correct.
Adding a second term brings the error down to the order of $$10^{-16}$$.

The demo avoids recalculating large factorials from scratch.
If

$$
a_k=\frac{(4k)!}{(k!)^4\,396^{4k}},
$$

then the next coefficient follows from

$$
\frac{a_{k+1}}{a_k}=
\frac{(4k+1)(4k+2)(4k+3)(4k+4)}{(k+1)^4\,396^4}.
$$

We still need enough arithmetic precision to preserve the small contributions we are adding.
The calculation uses a local copy of [Decimal.js](https://mikemcl.github.io/decimal.js/) with guard digits, rather than JavaScript's ordinary number type.
This controls arithmetic precision; it does not turn a finite partial sum into the exact infinite sum.

## 4. Chudnovsky: a different fast series

The formula below is related in spirit to Ramanujan's work, but it is a **Chudnovsky series**, and deserves its own name and demo:

$$
\pi=\frac{426880\sqrt{10005}}{displaystyle
\sum_{k=0}^{\infty}
\frac{(-1)^k(6k)!\,(13591409+545140134k)}
{(3k)!\,(k!)^3\,640320^{3k}}}.
$$

It gains roughly fourteen decimal digits per additional term.
The coefficients can again be updated by a recurrence, avoiding repeated factorial computations.
This family of formulas is used in serious high-precision computation; the [FLINT documentation](https://flintlib.org/doc/algorithms/special-functions/constants.html) describes its implementation, while [Fabrice Bellard's computation report](https://bellard.org/pi/pi2700e9/pipcrecord.pdf) gives a practical example using the series.

{% include pi-demo.liquid method='chudnovsky' title='Compare a faster series' description='Use the same small term counts as in the Ramanujan demo and compare how many leading digits settle.' maximum='12' initial='1' %}

The number of terms is only part of the computational cost.
A term involving long integers or high-precision decimals costs more than a single floating-point addition.
Large implementations use techniques such as binary splitting to organize the arithmetic efficiently; this browser version uses a simpler recurrence that is easier to inspect.

Both fast-series demos run in background workers, so the page stays responsive and the **Cancel** button can stop a calculation.
Their precision settings are independent, and the library is served locally with the site.
You can read the [numerical worker source](/assets/js/projects/pi-worker.js) to see the two recurrences and the precision choices.

## 5. Galperin's method: count the collisions

Now we'll leave series behind and consider two blocks on a frictionless line, with a wall on the left.
The small block starts at rest between the wall and a larger block moving toward it.
All collisions are perfectly elastic.
We count **both** block-block impacts and impacts of the small block with the wall, stopping when no further collision can occur.

If the masses are $$m$$ and $$M$$ and their incoming velocities are $$u$$ and $$v$$, conservation of momentum and kinetic energy gives

$$
u'=\frac{m-M}{m+M}u+\frac{2M}{m+M}v,\qquad
v'=\frac{2m}{m+M}u+\frac{M-m}{m+M}v.
$$

At the wall, the small block's velocity simply changes sign.
Both outgoing block velocities must be calculated from the **old** velocities before updating either block.

For the mass ratios used in the demo, the final collision counts reveal leading digits of 𝜋:

| Mass ratio $$M/m$$ | Total collisions | Digits read from the count |
| --- | --- | --- |
| 1 | 3 | 3 |
| 100 | 31 | 3.1 |
| 10,000 | 314 | 3.14 |
| 1,000,000 | 3,141 | 3.141 |

{% include pi-demo.liquid method='collisions' title='Let the blocks count' description='Choose a mass ratio, then count the impacts. Pause to inspect the state or increase the playback speed.' %}

Why does a circle constant appear in a one-dimensional problem?
In coordinates $$\sqrt m\,u$$ and $$\sqrt M\,v$$, fixed kinetic energy describes a circle in velocity space.
The collision rules act as reflections, introducing an angle related to $$\arctan\sqrt{m/M}$$.
Galperin's original paper, [“Playing pool with 𝜋”](https://www.maths.tcd.ie/~lebed/Galperin.%20Playing%20pool%20with%20pi.pdf), develops the geometric argument.

The browser simulation advances directly to the next wall or block impact, rather than using small time steps that might let blocks pass through one another.
It still uses finite-precision arithmetic, so the ideal mathematical construction should not be confused with a guarantee of unlimited numerical accuracy.
I limit the demo to four digits to keep its behavior and running time manageable.

Each extra digit requires about ten times as many collision events.
It is a striking connection between mechanics and geometry, but an inefficient way to compute a long decimal expansion.
The count supplies leading digits, rather than a rounded estimate at the last displayed place.

## 6. Monte Carlo: estimate an area by sampling

Consider a point with coordinates $$X$$ and $$Y$$ chosen uniformly in the unit square $$[0,1]^2$$.
It lies inside the unit quarter disk exactly when $$X^2+Y^2\leq1$$.
Since the square has area one and the quarter disk has area $$\pi/4$$,

$$
p=\Pr(X^2+Y^2\leq1)=\frac{\pi}{4}.
$$

If $$H$$ out of $$N$$ sampled points land inside the disk, we estimate 𝜋 with

$$
\widehat\pi=4\frac{H}{N}.
$$

Under the model of independent uniform samples, $$H$$ is binomial and the estimator is unbiased:

$$
\mathbb E[\widehat\pi]=\pi,\qquad
\operatorname{Var}(\widehat\pi)=\frac{16p(1-p)}{N}.
$$

The standard error therefore decreases like $$1/\sqrt N$$.
Roughly 100 times as many points are needed to reduce the typical error by a factor of ten.
Random sampling is useful in problems where direct integration is difficult, but it is not competitive with the fast series for calculating 𝜋.

{% include pi-demo.liquid method='monte-carlo' title='Fill the square with samples' description='Run a repeatable experiment: green points land inside the quarter circle, and muted red points land outside.' %}

The interval shown by the demo uses the normal approximation

$$
\widehat\pi\;\pm\;1.96\times4
\sqrt{\frac{\widehat p(1-\widehat p)}{N}},\qquad
\widehat p=H/N.
$$

It is an **approximate 95% confidence interval** under the independent-sampling model, intended for a fixed final sample size with sufficiently many hits and misses.
The confidence level describes repeated experiments; it does not assign a 95% probability to a fixed value of 𝜋 after the interval has been observed.
Repeatedly inspecting a running interval is also different from a fixed-sample guarantee.
The [NIST engineering handbook](https://www.itl.nist.gov/div898/handbook/prc/section2/prc241.htm) discusses confidence intervals for binomial proportions and more robust alternatives.

The demo uses a seeded pseudorandom generator so that resetting with the same seed reproduces the same point sequence.
Pseudorandomness is not itself a flaw that makes Monte Carlo unusable, but a small browser demo does not establish that a generator is suitable for every statistical application.
Try several seeds and compare the fluctuations at the same sample count.
An estimate can temporarily move farther from 𝜋 even while the long-run sampling error tends to decrease.

## Comparing the methods

| Method | What improves the result? | Characteristic behavior |
| --- | --- | --- |
| Polygon bounds | More sides | Geometric error decreases like $$1/n^2$$. |
| Madhava-Gregory-Leibniz | More terms | Truncation error decreases like $$1/N$$. |
| Ramanujan | More terms and sufficient arithmetic precision | Roughly eight additional decimal digits per term. |
| Chudnovsky | More terms and sufficient arithmetic precision | Roughly fourteen additional decimal digits per term. |
| Elastic collisions | A larger mass ratio | About ten times as many impacts for each extra digit. |
| Monte Carlo | More samples | Typical statistical error decreases like $$1/\sqrt N$$. |

I suggest comparing **convergence**, **arithmetic precision**, and **work performed**, rather than only the length of the displayed number.
The polygon method gives a geometric enclosure, the series expose different convergence rates, collisions encode the digits in a dynamical system, and Monte Carlo estimates a probability.
Together, they show how the same constant can emerge from very different mathematical structures.
