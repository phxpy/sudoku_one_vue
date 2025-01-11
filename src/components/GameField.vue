<template>
    <div class="field" @mousedown="selectionStore.selectCell">
        <ul class="field__box" v-for="n in 9" :key="`box-${n}`">
            <GameFieldCell
                v-for="(cellNumber, index) in globalStore.puzzle.initialState.slice((n-1)*9, (n-1)*9+9)" :key="`${index}-${n}`"
                :hardwired="+cellNumber > 0"
                :cellIndex="index + (n-1)*9 + 1"
                :cellValue="+cellNumber > 0 ? cellNumber : ''"
            >
            </GameFieldCell>
        </ul>
    </div>
</template>

<script setup lang="ts">
    import GameFieldCell from "./GameFieldCell.vue"
    import { useSelectionStore } from "@/store/selection"
    import { useGlobalStore } from "@/store/global";
    import { onMounted } from "vue";

    const selectionStore = useSelectionStore()
    const globalStore = useGlobalStore()

    onMounted(() => {
        setRatioKropki()
        setDifferenceKropki()
    })

    const setRatioKropki = () => {
        globalStore.puzzle.ratio && globalStore.puzzle.ratio.forEach(item => {
            document.querySelector(`[data-pos="${item.split("-")[0]}"]`)!.classList.add(`field__cell--ratio-${item.split("-")[1]}`)
        })
    }

    const setDifferenceKropki = () => {
        globalStore.puzzle.difference && globalStore.puzzle.difference.forEach(item => {
            document.querySelector(`[data-pos="${item.split("-")[0]}"]`)!.classList.add(`field__cell--diff-${item.split("-")[1]}`)
        })
    }
</script>

<style lang="scss">
    .field {
        grid-column: 1;
        grid-row: 1 / -1;
        align-self: center;
        justify-self: end;
        display: inline-grid;
        grid-template-columns: repeat(3, auto);
        gap: 3px;
        border: 3px solid #333;
        background-color: #333;
    }

    .field__box {
        display: grid;
        grid-template-columns: repeat(3, auto);
        gap: 1px;
        background-color: #999;
    }
</style>
