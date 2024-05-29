<template>
    <div class="controls">
        <div class="timer">00:00:00</div>
        <ul class="numpad numpad__numbers" :class="globalStore.activeNumpad === 'numbers' ? 'numpad--active' : ''">
            <li class="numpad__item" v-for="n in 9" :key="`numpad-number-${n}`">
                <button class="controls__item-btn numpad__btn" @click="emitter.emit('input-number', n)">{{ n }}</button>
            </li>
        </ul>
        <ul class="numpad numpad__corners" :class="globalStore.activeNumpad === 'corners' ? 'numpad--active' : ''">
            <li class="numpad__item" v-for="n in 9" :key="`numpad-corner-${n}`">
                <button class="controls__item-btn numpad__btn" @click="emitter.emit('input-corners', n)">
                    <span class="numpad__btn--corner" :class="`numpad__btn--corner-${n}`">{{ n }}</span>
                </button>
            </li>
        </ul>
        <ul class="numpad numpad__centers" :class="globalStore.activeNumpad === 'centers' ? 'numpad--active' : ''">
            <li class="numpad__item" v-for="n in 9" :key="`numpad-center-${n}`">
                <button class="controls__item-btn numpad__btn" @click="emitter.emit('input-centers', n)">
                    <span class="numpad__btn--center-mark">{{ n }}</span>
                </button>
            </li>
        </ul>
        <ul class="numpad numpad__colors" :class="globalStore.activeNumpad === 'colors' ? 'numpad--active' : ''">
            <li class="numpad__item" v-for="(color, index) in COLORS" :key="`numpad-color-${index}`">
                <button class="controls__item-btn numpad__btn" @click="emitter.emit('input-color', color)">
                    <label class="controls__item-btn-color-label">{{ color }}
                        <input class="controls__item-btn-color-input" type="color" disabled :value="color">
                    </label>
                </button>
            </li>
        </ul>
        <ul class="controls__aside">
            <li class="controls__item">
                <input class="controls__item-radio visuallyhidden" id="controls-numbers" data-class="numpad__numbers"
                       type="radio" name="controls" value="numbers" v-model="globalStore.activeNumpad" checked>
                <label class="controls__item-label" for="controls-numbers">numbers<span
                    class="controls__item-btn-label">#</span>
                </label>
            </li>
            <li class="controls__item">
                <input class="controls__item-radio visuallyhidden" id="controls-corners" data-class="numpad__corners"
                       type="radio" name="controls" value="corners" v-model="globalStore.activeNumpad">
                <label class="controls__item-label" for="controls-corners">corner marks<span
                    class="field__cell-corner-mark field__cell-corner-mark--1">1</span><span
                    class="field__cell-corner-mark field__cell-corner-mark--2">2</span><span
                    class="field__cell-corner-mark field__cell-corner-mark--9">9</span>
                </label>
            </li>
            <li class="controls__item">
                <input class="controls__item-radio visuallyhidden" id="controls-centers" data-class="numpad__centers"
                       type="radio" name="controls" value="centers" v-model="globalStore.activeNumpad">
                <label class="controls__item-label" for="controls-centers">center marks<span
                    class="field__cell-center-mark">1</span><span class="field__cell-center-mark">2</span><span
                    class="field__cell-center-mark">4</span>
                </label>
            </li>
            <li class="controls__item">
                <input class="controls__item-radio visuallyhidden" id="controls-colors" data-class="numpad__colors"
                       type="radio" name="controls" value="colors" v-model="globalStore.activeNumpad">
                <label class="controls__item-label" for="controls-colors">colors
                    <svg class="controls__item-btn-icon" xmlns="http://www.w3.org/2000/svg" fill="none"
                         viewBox="0 0 513 478">
                        <path fill="#7FC96B"
                              d="M300.138 326.621c0 82.882-67.187 150.069-150.069 150.069C67.187 476.69 0 409.503 0 326.621c0-82.882 67.187-150.069 150.069-150.069 82.882 0 150.069 67.187 150.069 150.069Z"></path>
                        <path fill="#E63232"
                              d="M406.138 150.069c0 82.882-67.187 150.069-150.069 150.069-82.882 0-150.069-67.187-150.069-150.069C106 67.187 173.187 0 256.069 0c82.882 0 150.069 67.187 150.069 150.069Z"></path>
                        <path fill="#277DA1"
                              d="M512.138 327.069c0 82.882-67.187 150.069-150.069 150.069-82.882 0-150.069-67.187-150.069-150.069C212 244.187 279.187 177 362.069 177c82.882 0 150.069 67.187 150.069 150.069Z"></path>
                    </svg>
                </label>
            </li>
            <li class="controls__item">
                <button class="controls__item-label controls__item-label--danger" id="refreshBtn" @click="emitter.emit('refresh')">refresh
                    <svg class="controls__item-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                         fill="#fff">
                        <path
                            d="M20.944 12.979C20.455 17.488 16.638 21 12 21a8.974 8.974 0 0 1-6.763-3.075l1.245-1.633A6.985 6.985 0 0 0 12 19c3.526 0 6.444-2.624 6.923-6.021H16l4-5.25 4 5.25h-3.056zM5.08 11c.487-3.387 3.4-6 6.92-6a6.984 6.984 0 0 1 5.51 2.698l1.244-1.632A8.97 8.97 0 0 0 12 3c-4.632 0-8.443 3.501-8.941 8H0l4 5.25L8 11H5.08z"></path>
                    </svg>
                </button>
            </li>
        </ul>
        <button class="controls__item-btn numpad__btn numpad__btn--wide" id="deleteBtn" @click="emitter.emit('delete-cell')">delete</button>
        <button class="controls__item-btn numpad__btn numpad__btn--wide numpad__btn--success" id="checkSolution" @click="emitter.emit('check-solution')">check</button>
    </div>
</template>

<script setup lang="ts">
    import { useGlobalStore } from "@/store/global";
    import { COLORS } from "@/store/constants";
    import emitter from "@/eventbus";

    const globalStore = useGlobalStore()

    emitter.on("check-solution", () => {
        globalStore.checkSolution()
    })
</script>

<style scoped lang="scss">
@import url(@/assets/styles/numpad.scss);
</style>
