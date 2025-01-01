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

<details>
    <summary>
        C++ implementation
    </summary>

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
</details>


## Cocktail Shaker sort

{% include sorting.liquid algo='cocktailshaker' %}

<details>
    <summary>
        C++ implementation
    </summary>

    ```cpp
    template <typename T> inline void ShakerSort(
        T* arr, size_t start, size_t end,
        bool (*compare)(T a, T b) = [](T a, T b) {return (a > b); },
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
</details>


## Insertion sort

{% include sorting.liquid algo='insertion' %}

<details>
    <summary>
        C++ implementation
    </summary>

    ```cpp
    template <typename T> inline void InsertionSort(
        T* arr, size_t start, size_t end,
	    bool (*compare)(T a, T b) = [](T a, T b) {return (a < b); },
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
</details>


## Selection sort

{% include sorting.liquid algo='selection' %}

<details>
    <summary>
        C++ implementation
    </summary>

    ```cpp
    template <typename T> inline void SelectionSort(
        T* arr, size_t start, size_t end,
        bool (*compare)(T a, T b) = [](T a, T b) {return (a > b); },
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
</details>


## Odd Even sort

{% include sorting.liquid algo='oddeven' %}

<details>
    <summary>
        C++ implementation
    </summary>

    ```cpp
    template <typename T> inline void OddEvenSort(
        T* arr, size_t start, size_t end,
        bool (*compare)(T a, T b) = [] (T a, T b) {return (a > b);},
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
</details>


## Quick sort

{% include sorting.liquid algo='quick' %}

<details>
    <summary>
        C++ implementation
    </summary>

    ```cpp
    template <typename T> inline size_t QuickSortDivision(
        T* arr, size_t since, size_t to,
        bool (*compare)(T a, T b) = [](T a, T b) {return (a <= b); },
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
    template <typename T> inline void QuickSort(T* arr, size_t since, size_t to,
        bool (*compare)(T a, T b) = [](T a, T b) {return (a <= b); },
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
</details>