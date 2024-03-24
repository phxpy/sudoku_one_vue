<template>
    <router-view></router-view>
</template>

<script setup lang="ts">
    import { useSelectionStore } from '@/store/selection';
    import { onMounted } from 'vue';
    import { useInputStore } from "@/store/input";

    const selectionStore = useSelectionStore()
    const inputStore = useInputStore()

    onMounted(() => {
        window.addEventListener("keydown", event =>  {
            event.preventDefault()

            if (+event.key > 0 && +event.key <= 9 && !event.shiftKey && !event.ctrlKey && selectionStore.selectedCells.length) {
                inputStore.inputNumber(event)
            }

            if (event.shiftKey && !event.ctrlKey && Object.keys(inputStore.SYMBOLS).includes(event.key) && selectionStore.selectedCells.length) {
                inputStore.inputCorners(event)
            }

            if (event.ctrlKey && !event.shiftKey && +event.key > 0 && +event.key <= 9 && selectionStore.selectedCells.length) {
                inputStore.inputCenters(event)
            }

            if ((event.key === "Delete" || event.key === "Backspace") && selectionStore.selectedCells.length) {
                inputStore.deleteCell()
            }

            if (event.ctrlKey && event.shiftKey && Object.keys(inputStore.COLORS).includes(event.key) && selectionStore.selectedCells.length) {
                inputStore.colorCells(event)
            }
        })
    })
</script>
