---
layout: page
title: Sorting Algorithms simulation
description: >
    Play with many sorting algorithms rendered in canvas and understand how they work.
    Each one is accompanied with a simple c++ implementation
img: assets/img/12.jpg
importance: 1
category: education
---

## Bubble sort
<div class="view">
    <div class="input">
        <span>
            Array size:
        </span>
        <input type="number" min="4" max="1024" step="1" value="32" id="bubble-tot">
    </div>
    <div class="input">
        <span>
            Iterational-delay:
        </span>
        <input type="number" min="10" max="1000" step="1" value="100" id="bubble-interval">
    </div>
    <div class="cnv">
        <canvas id="bubble" width="1350" heght="900"></canvas>
    </div>
    <div class="btn">
        <button type="button" onclick="bubble.Input()" class="shuffle pressable">Shuffle</button>
    </div>
    <div class="btn">
        <button type="button" onclick="bubble.Sort()" id="bubble-btn" class="pressable">Sort</button>
    </div>
    <div class="p">
        <p class="text">
            <span>
                Swaps:
            </span>
            <span id="bubble-swaps"></span>
        </p>
    </div>
</div>

```cpp
template <typename T> inline void BubbleSort(
    T* arr, size_t start, size_t end,
	bool (*compare)(T a, T b) = [] (T a, T b) {return (a > b);},
	void (*swap)(T* a, T* b) = [](T* a, T* b) { T c = *a; *a = *b; *b = c; })
{
	for (size_t i = end; i > start; i--)
	{
		for (size_t j = start; j < i - 1U; j++)
		{
			if (compare(arr[j], arr[j + 1U]))
			{
				swap(&arr[j], &arr[j + 1U]);
			}
		}
	}
}
```
<script defer src="{{ '/assets/js/projects/sorting.js' | relative_url }}"></script>