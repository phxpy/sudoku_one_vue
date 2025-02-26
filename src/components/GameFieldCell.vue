<template>
    <li class="field__cell" :class="{ 'field__cell--hardwired': hardwired }" ref="cell" :style="cellColorProp" :data-pos="cellIndex">
        <div class="field__cell-inner field__cell-number">{{ cellNumber }}</div>
        <div class="field__cell-inner field__cell-borders"></div>
        <div class="field__cell-inner field__cell-corners" v-html="cellCorners"></div>
        <div class="field__cell-inner field__cell-centers">{{ cellCenters }}</div>
        <div class="field__cell-hovercell"></div>
        <div class="field__cell-selection"></div>
    </li>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import emitter from '@/eventbus';
import { useGlobalStore } from '@/store/global';

const props = defineProps<{
    hardwired: boolean,
    cellIndex: number,
    cellValue: string | number
}>()

const globalStore = useGlobalStore()
const cell = ref<HTMLLIElement | null>(null)

let cellNumber = ref(props.cellValue)
let centersArr = ref<number[]>([])
let cornersArr = ref<string[]>([])
let cellColors = ref<string[]>([])

const cellCenters = computed(() => {
    return [...centersArr.value].sort().join("")
})

const cellCorners = computed(() => {
    let htmlString = ""

    if (cornersArr.value.length) {

        [...cornersArr.value].sort().forEach(item => {
            const markedClass = item[item.length - 1] === "m" ? "field__cell-corner-mark--rounded" : ""

            htmlString += `
                    <span
                        class="field__cell-corner-mark field__cell-corner-mark--${item[0]} ${markedClass}"
                    >
                        ${item[0]}
                    </span>
                `
        });
    }

    return htmlString
})

const cellColorProp = computed(() => {
    let gradientString = ""

    if (cellColors.value.length === 0) {
        return ""
    } else if (cellColors.value.length === 1) {
        return `background-color: ${cellColors.value[0]};`
    } else {
        const percent = parseInt((100 / cellColors.value.length).toFixed(0))
        const gap = 1

        Array.from(cellColors.value).sort().forEach((colorItem, index) => {
            if (index === 0) {
                gradientString += `${colorItem} calc(${percent}% - ${gap}px)`
            } else if (index === cellColors.value.length - 1) {
                gradientString += `, ${colorItem} calc(${percent * index}% + ${gap}px)`
            } else {
                gradientString += `, ${colorItem} calc(${percent * index}% + ${gap}px), ${colorItem} calc(${percent * (index + 1)}% - ${gap}px)`
            }
        })
        return `background-image: linear-gradient(120deg, ${gradientString});`
    }
})

function clearCell(
    except: "number" | "centers" | "corners" | "colors" | null
): void {
    if (except === "number") {
        cornersArr.value = []
        centersArr.value = []
    } else if (except === "centers") {
        cellNumber.value = ""
        cornersArr.value = []
    } else if (except === "corners") {
        cellNumber.value = ""
        centersArr.value = []
    } else {
        cellNumber.value = ""
        centersArr.value = []
        cornersArr.value = []
        cellColors.value = []
    }
}

onMounted(() => {
    emitter.on("input-number", (key: number) => {
        if (
            !cell.value!.classList.contains("field__cell--hardwired") &&
            (
                cell.value!.classList.contains("field__cell--active") ||
                cell.value!.classList.contains("field__cell--one-active")
            )
        ) {
            clearCell("number")
            cellNumber.value = key
            globalStore.setSolutionNumber(key, props.cellIndex)
        }
    })

    emitter.on("input-corners", (key: number) => {
        if (
            !cell.value!.classList.contains("field__cell--hardwired") &&
            (
                cell.value!.classList.contains("field__cell--active") ||
                cell.value!.classList.contains("field__cell--one-active")
            )
        ) {
            clearCell("corners")
            if (cornersArr.value.includes(`${key}`)) {
                cornersArr.value.splice(cornersArr.value.indexOf(`${key}`), 1)
            } else if (cornersArr.value.includes(`${key}m`)) {
                cornersArr.value.splice(cornersArr.value.indexOf(`${key}m`), 1)
            } else {
                cornersArr.value.push(`${key}`)
            }
        }
    })

    emitter.on("input-centers", (key: number) => {
        if (
            !cell.value!.classList.contains("field__cell--hardwired") &&
            (
                cell.value!.classList.contains("field__cell--active") ||
                cell.value!.classList.contains("field__cell--one-active")
            )
        ) {
            clearCell("centers")
            if (centersArr.value.includes(key)) {
                centersArr.value.splice(centersArr.value.indexOf(key), 1)
            } else {
                centersArr.value.push(key)
            }
        }
    })

    emitter.on("input-color", (color: string) => {
        if (
            cell.value!.classList.contains("field__cell--active") ||
            cell.value!.classList.contains("field__cell--one-active")
        ) {
            if (cellColors.value.includes(color)) {
                cellColors.value.splice(cellColors.value.indexOf(color), 1)
            } else {
                cellColors.value.push(color)
            }
        }
    })

    emitter.on("delete-cell", () => {
        if (
            !cell.value!.classList.contains("field__cell--hardwired") &&
            (
                cell.value!.classList.contains("field__cell--active") ||
                cell.value!.classList.contains("field__cell--one-active")
            )
        ) {
            clearCell(null)
            globalStore.deleteSolutionNumber(props.cellIndex)
        } else if (
            cell.value!.classList.contains("field__cell--hardwired") &&
            (
                cell.value!.classList.contains("field__cell--active") ||
                cell.value!.classList.contains("field__cell--one-active")
            )
        ) {
            cellColors.value = []
        }
    })

    emitter.on("refresh", () => {
        if (
            !cell.value!.classList.contains("field__cell--hardwired")
        ) {
            clearCell(null)
        } else {
            cellColors.value = []
        }
    })

    emitter.on("mark-number", (key: number) => {
        if (
            !cell.value!.classList.contains("field__cell--hardwired") &&
            (
                cell.value!.classList.contains("field__cell--active") ||
                cell.value!.classList.contains("field__cell--one-active")
            )
        ) {
            if (cornersArr.value.includes(`${key}`)) {
                cornersArr.value.splice(cornersArr.value.indexOf(`${key}`), 1, `${key}m`)
            } else if (cornersArr.value.includes(`${key}m`)) {
                cornersArr.value.splice(cornersArr.value.indexOf(`${key}m`), 1, `${key}`)
            }
        }
    })
})
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
    text-shadow: 0 0 3px #fff;
    user-select: none;
    background-color: #fff;
}

.field__cell-centers {
    overflow: hidden;
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

.field__cell--active+.field__cell--active:not(:nth-child(3n+1)) .field__cell-borders {
    border-left: none;
}

@for $i from 1 through 6 {
    .field__cell--active:nth-child(#{$i}):has(~ .field__cell--active:nth-child(#{$i+3})) .field__cell-borders {
        bottom: -$border-width - 1;
        border-bottom: none;
    }

    .field__cell--active:nth-child(#{$i})~.field__cell--active:nth-child(#{$i+3}) .field__cell-borders {
        top: -$border-width - 1;
        border-top: none;
    }
}

$cellNumbers: 3, 6, 9;

@each $n in $cellNumbers {
    .field__box:not(:nth-child(3n)):has(+ .field__box .field__cell--active:nth-child(#{$n - 2})) .field__cell--active:nth-child(#{$n}) .field__cell-borders {
        border-right: none;
    }

    .field__box:has(.field__cell--active:nth-child(#{$n}))+.field__box:not(:nth-child(3n-2)) .field__cell--active:nth-child(#{$n - 2}) .field__cell-borders {
        border-left: none;
    }
}

@for $n from 1 through 6 {
    @for $k from 7 through 9 {
        .field__box:nth-child(#{$n}):has(~ .field__box:nth-child(#{$n + 3}) .field__cell--active:nth-child(#{$k - 6})) .field__cell--active:nth-child(#{$k}) .field__cell-borders {
            bottom: -$border-width - 3;
            border-bottom: none;
        }

        .field__box:nth-child(#{$n}):has(.field__cell--active:nth-child(#{$k}))~.field__box:nth-child(#{$n + 3}) .field__cell--active:nth-child(#{$k - 6}) .field__cell-borders {
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
    background-color: rgba(255, 255, 255, 0.5);
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

.field__cell-corner-mark--rounded::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    aspect-ratio: 1 / 1;
    transform: translate(-50%, -50%);
    // border-radius: 50%;
    border: 1px solid $input-cell-color;
}

.field__cell-centers,
.field__cell-center-mark {
    font-size: 20px;
    line-height: 1;
}

.field__cell--ratio-r::before,
.field__cell--ratio-b::after,
.field__cell--diff-r::before,
.field__cell--diff-b::after {
    content: "";
    position: absolute;
    z-index: 10;
    width: calc($cell-size / 4);
    height: calc($cell-size / 4);
    border-radius: 50%;
    border: 3px solid #000;
}

.field__cell--ratio-r::before,
.field__cell--ratio-b::after {
    background-color: #000;
}

.field__cell--diff-r::before,
.field__cell--diff-b::after {
    background-color: #fff;
}

.field__cell--ratio-r::before,
.field__cell--diff-r::before {
    top: 50%;
    right: 0;
    transform: translate(50%, -50%);
}

.field__cell--ratio-b::after,
.field__cell--diff-b::after {
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 50%);
}
</style>
