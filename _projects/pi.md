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
<script defer src="{{ '/assets/js/projects/pi.js' | relative_url }}"></script>


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
        <canvas id="archimedes-canvas" width="1000" height="1000"></canvas>
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
        <canvas id="archimedes-canvas-2" width="1000" height="1000"></canvas>
    </div>
</div>