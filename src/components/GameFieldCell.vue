<template>
    <li class="field__cell" :class="{'field__cell--hardwired': hardwired}" :data-num="cellIndex">
        <div class="field__cell-inner field__cell-number">
            <slot></slot>
        </div>
        <div class="field__cell-inner field__cell-borders"></div>
        <div class="field__cell-inner field__cell-corners"></div>
        <div class="field__cell-inner field__cell-centers"></div>
        <div class="field__cell-hovercell"></div>
        <div class="field__cell-selection"></div>
    </li>
</template>

<script setup lang="ts">
    defineProps<{
        hardwired: Boolean,
        cellIndex: Number
    }>()
</script>

<style lang="scss">
    .field__cell {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: $cell-size;
        height: $cell-size;
        font-size: 60px;
        font-weight: 500;
        color: #000;
        line-height: 1;
        user-select: none;
        background-color: #fff;
    }

    .field__cell:not(.field__cell--hardwired) {
        color: $main-dark-color;
    }

    .field__cell--active .field__cell-borders,
    .field__cell--one-active .field__cell-borders {
        border: $border-width solid $border-color;
    }

    .field__cell--active:not(:nth-child(3n)):has(+ .field__cell--active) .field__cell-borders {
        border-right: none;
    }

    .field__cell--active + .field__cell--active:not(:nth-child(3n+1)) .field__cell-borders {
        border-left: none;
    }

    @for $i from 1 through 6 {
        .field__cell--active:nth-child(#{$i}):has(~ .field__cell--active:nth-child(#{$i+3})) .field__cell-borders {
            bottom: -$border-width - 1;
            border-bottom: none;
        }

        .field__cell--active:nth-child(#{$i}) ~ .field__cell--active:nth-child(#{$i+3}) .field__cell-borders {
            top: -$border-width - 1;
            border-top: none;
        }
    }

    $cellNumbers: 3, 6, 9;
    @each $n in $cellNumbers {
        .field__box:not(:nth-child(3n)):has(+ .field__box .field__cell--active:nth-child(#{$n - 2})) .field__cell--active:nth-child(#{$n}) .field__cell-borders {
            border-right: none;
        }

        .field__box:has(.field__cell--active:nth-child(#{$n})) + .field__box:not(:nth-child(3n-2)) .field__cell--active:nth-child(#{$n - 2}) .field__cell-borders {
            border-left: none;
        }
    }

    @for $n from 1 through 6 {
        @for $k from 7 through 9 {
            .field__box:nth-child(#{$n}):has(~ .field__box:nth-child(#{$n + 3}) .field__cell--active:nth-child(#{$k - 6})) .field__cell--active:nth-child(#{$k}) .field__cell-borders {
                bottom: -$border-width - 3;
                border-bottom: none;
            }

            .field__box:nth-child(#{$n}):has(.field__cell--active:nth-child(#{$k})) ~ .field__box:nth-child(#{$n + 3}) .field__cell--active:nth-child(#{$k - 6}) .field__cell-borders {
                top: -$border-width - 3;
                border-top: none;
            }
        }
    }

    .field__cell-inner {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 3;
        display: flex;
        justify-content: center;
        align-items: center;
        pointer-events: none;
    }

    .field__cell:not(.field__cell--hardwired) .field__cell-inner {
        color: $input-cell-color;
    }

    .field__cell-hovercell {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
        width: $cell-size - 10px;
        height: $cell-size - 10px;
        background-color: transparent;
    }

    .field__cell--one-active .field__cell-selection,
    .field__cell--active .field__cell-selection {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 3;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.4);
    }

    .field__cell--one-active .field__cell-borders,
    .field__cell--active .field__cell-borders {
        z-index: 4;
    }

    .field__cell-corner-mark,
    .numpad__btn--corner {
        position: absolute;
        display: block;
        font-size: 20px;
        line-height: 1;
    }

    .field__cell-corner-mark--1,
    .numpad__btn--corner-1 {
        top: 8px;
        left: 8px;
    }

    .field__cell-corner-mark--2,
    .numpad__btn--corner-2 {
        top: 8px;
        left: 50%;
        transform: translateX(-50%);
    }

    .field__cell-corner-mark--3,
    .numpad__btn--corner-3 {
        top: 8px;
        right: 8px;
    }

    .field__cell-corner-mark--4,
    .numpad__btn--corner-4 {
        top: 50%;
        left: 8px;
        transform: translateY(-50%);
    }

    .field__cell-corner-mark--5,
    .numpad__btn--corner-5 {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .field__cell-corner-mark--6,
    .numpad__btn--corner-6 {
        top: 50%;
        right: 8px;
        transform: translateY(-50%);
    }

    .field__cell-corner-mark--7,
    .numpad__btn--corner-7 {
        bottom: 8px;
        left: 8px;
    }

    .field__cell-corner-mark--8,
    .numpad__btn--corner-8 {
        bottom: 8px;
        left: 50%;
        transform: translateX(-50%);
    }

    .field__cell-corner-mark--9,
    .numpad__btn--corner-9 {
        bottom: 8px;
        right: 8px;
    }

    .field__cell-centers,
    .field__cell-center-mark {
        font-size: 20px;
        line-height: 1;
    }
</style>
