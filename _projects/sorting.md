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

<script defer src="{{ '/assets/js/projects/sorting.js' | relative_url }}"></script>


## Bubble sort

{% include sorting.liquid algo='bubble' %}

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


## Cocktail Shaker sort

{% include sorting.liquid algo='cocktailshaker' %}

```cpp
template <typename T> inline void ShakerSort(
    T* arr, size_t start, size_t end,
    bool (*compare)(T a, T b) = [](T a, T b) { return (a > b); },
    void (*swap)(T* a, T* b) = [](T* a, T* b) { T c = *a; *a = *b; *b = c; })
{
    size_t len = end - start;
    for (size_t p = 1U + start; p <= len / 2; p++)
    {
        for (size_t i = p - 1U; i < len - p; i++)
            if (compare(arr[i], arr[i + 1U]))
                swap(&arr[i], &arr[i + 1U]);
        for (size_t i = len - p - 1U; i >= p; i--)
            if (!compare(arr[i], arr[i - 1U]))
                swap(&arr[i], &arr[i - 1U]);
    }
}
```


## Insertion sort

{% include sorting.liquid algo='insertion' %}

```cpp
template <typename T> inline void InsertionSort(
    T* arr, size_t start, size_t end,
    bool (*compare)(T a, T b) = [](T a, T b) { return (a < b); },
    void (*swap)(T* a, T* b) = [](T* a, T* b) { T c = *a; *a = *b; *b = c; })
{
    for (size_t i = start + 1U; i < end; i++)
    {
        size_t j = i;
        while (j > start)
        {
            if (compare(arr[j], arr[j - 1U]))
            {
                swap(&arr[j], &arr[j - 1U]);
                j--;
            }
            else {
                j = start;
            }
        }
    }
}
```

## Selection sort

{% include sorting.liquid algo='selection' %}

```cpp
template <typename T> inline void SelectionSort(
    T* arr, size_t start, size_t end,
    bool (*compare)(T a, T b) = [](T a, T b) { return (a > b); },
    void (*swap)(T* a, T* b) = [](T* a, T* b) { T c = *a; *a = *b; *b = c; })
{
    size_t min = 0;
    for (size_t i = start; i < end; i++)
    {
        min = i;
        for (size_t j = i; j < finisci; j++)
        {
            if (compare(arr[min], arr[j]))
            {
                min = j;
            }
        }
        swap(&arr[i], &arr[min]);
    }
}
```

## Odd Even sort

{% include sorting.liquid algo='oddeven' %}

```cpp
template <typename T> inline void OddEvenSort(
    T* arr, size_t start, size_t end,
    bool (*compare)(T a, T b) = [] (T a, T b) { return (a > b); },
    void (*swap)(T* a, T* b) = [](T* a, T* b) { T c = *a; *a = *b; *b = c; })
{
    bool comapred = true;
    size_t startindex = 1U, len = end - 1U;
    while (comapred)
    {
        compared = false;
        for (size_t i = startindex + start; i < len; i += 2U)
        {
            if (compare(arr[i], arr[i + 1U]))
            {
                swap(arr[i], arr[i + 1U]);
                compared = true;
            }
        }
        startindex = 1U - startindex;
    }
}
```

## Shell sort

{% include sorting.liquid algo='shell' swap_label='Shifts' %}

```cpp
template <typename T> inline void Sort(
    T* arr, size_t since, size_t to,
	bool (*compare)(T a, T b) = [](T a, T b) {return (a > b); },
	void (*assign)(T& a, const T& b) = [](T& a, const T& b) { a = b; })
{
	for (size_t gap = (to - since) / 2U; gap > 0; gap /= 2U)
	{
		for (size_t i = gap + since; i < to; i++)
		{
			T temp = arr[i];
			size_t j = i;
			for (; j >= (gap + since) && compare(arr[j - gap], temp); j -= gap)
			{
				assign(arr[j], arr[j - gap]);
			}
			assign(arr[j], temp);
		}
	}
}
```

## Quick sort

{% include sorting.liquid algo='quick' array_size='320' delay='20' %}

```cpp
template <typename T> inline size_t QuickSortDivision(
    T* arr, size_t since, size_t to,
    bool (*compare)(T a, T b) = [](T a, T b) { return (a <= b); },
    void (*swap)(T* a, T* b) = [](T* a, T* b) { T c = *a; *a = *b; *b = c; })
{
    T pivot = arr[to];
    size_t i = since - 1U;
    for (size_t j = since; j <= (to - 1U); j++)
    {
        if (compare(arr[j], pivot))
        {
            i++;
            swap(&arr[i], &arr[j]);
        }
    }
    swap(&arr[i + 1U], &arr[to]);
    return (i + 1U);
}
template <typename T> inline void QuickSort(
    T* arr, size_t since, size_t to,
    bool (*compare)(T a, T b) = [](T a, T b) { return (a <= b); },
    void (*swap)(T* a, T* b) = [](T* a, T* b) { T c = *a; *a = *b; *b = c; })
{
    if (since < to)
    {
        size_t Middle_ = QuickSortDivision<T>(arr, since, to, compare, swap);
        QuickSort<T>(arr, since, Middle_ - 1U, compare, swap);
        QuickSort<T>(arr, Middle_ + 1U, to, compare, swap);
    }
}
```

## Merge sort

{% include sorting.liquid algo='merge' array_size='320' delay='20' %}

```cpp
template <typename T> void inline Merge(
	T arr[], size_t since, size_t medium, size_t to,
	bool (*compare)(T a, T b) = [](T a, T b) {return (a <= b); },
	void (*copy)(T* a, const T* b) = [](T* a, const T* b) { *a = *b; })
{
	size_t len1 = medium - since + 1U;
	size_t len2 = to - medium;
	T *L = (T*) malloc(sizeof(T)* len1), *R = (T*)malloc(sizeof(T) * len2);
	for (size_t i = 0; i < len1; i++)
		copy(L + i, arr + since + i);
	for (size_t j = 0; j < len2; j++)
		copy(R + j, arr + medium + j + 1U);
	size_t k = since, i = 0, j = 0;
	while (i < len1 && j < len2)
	{
		if (compare(L[i], R[j]))
		{
			copy(arr + k, L + i);
			i++;
		}
		else
		{
			copy(arr + k, R + j);
			j++;
		}
		k++;
	}
	for (; i < len1; i++, k++)
	{
		copy(arr + k, L + i);
	}
	free(L);
	for (; j < len2; j++, k++)
	{
		copy(arr + k, R + j);
	}
	free(R);
}
template <typename T> void inline MergeSort(
    T arr[], size_t since, size_t to,
	bool (*compare)(T a, T b) = [](T a, T b) {return (a <= b); },
	void (*copy)(T* a, const T* b) = [](T* a, const T* b) { *a = *b; })
{
	if (since < to) {
		size_t m = since + (to - since) / 2U;
		MergeSort<T>(arr, since, m, compare, copy);
		MergeSort<T>(arr, m + 1U, to, compare, copy);
		Merge<T>(arr, since, m, to, compare, copy);
	}
}
```