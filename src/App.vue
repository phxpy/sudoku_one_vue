<template>
    <router-view></router-view>
</template>

<script setup lang="ts">
    import { useGlobalStore } from "@/store/global";
    import { useSelectionStore } from '@/store/selection';
    import { useInputStore } from "@/store/input";
    import { onMounted } from 'vue';

    const selectionStore = useSelectionStore()
    const inputStore = useInputStore()
    const globalStore = useGlobalStore()

    onMounted(() => {
        window.addEventListener("keydown", event =>  {
            const key = event.code.split("")[event.code.length - 1]
            event.preventDefault()

            if (!event.shiftKey && !event.ctrlKey && !event.altKey) {
                if (+key > 0 && +key <= 9 && selectionStore.selectedCells.length) {
                    inputStore.inputNumber(event)
                }
            }

            if (event.shiftKey && !event.ctrlKey && !event.altKey) {
                globalStore.setActiveNumpad("corners")

                if (+key > 0 && +key <= 9 && selectionStore.selectedCells.length) {
                    inputStore.inputCorners(event)
                }
            }

            if (event.ctrlKey && !event.shiftKey && !event.altKey) {
                globalStore.setActiveNumpad("centers")

                if (+key > 0 && +key <= 9 && selectionStore.selectedCells.length) {
                    inputStore.inputCenters(event)
                }
            }

            if (event.ctrlKey && event.shiftKey && !event.altKey) {
                globalStore.setActiveNumpad("colors")

                if (Object.keys(inputStore.COLORS).includes(key) && selectionStore.selectedCells.length) {
                    inputStore.colorCells(event)
                }
            }

            if ((event.key === "Delete" || event.key === "Backspace") && selectionStore.selectedCells.length) {
                inputStore.deleteCell()
            }
        })

        window.addEventListener("keyup", (e) => {
            if (e.key === "Control" || e.key === "Shift" || e.key === "Alt") {
                globalStore.setActiveNumpad("numbers")
            }
        })
    })
</script>
