<template>
    <router-view></router-view>
</template>

<script setup lang="ts">
    import { useGlobalStore } from "@/store/global";
    import { useSelectionStore } from '@/store/selection';
    import { useInputStore } from "@/store/input";
    import { onMounted } from 'vue';
    import emitter from '@/eventbus';

    const selectionStore = useSelectionStore()
    const inputStore = useInputStore()
    const globalStore = useGlobalStore()

    onMounted(() => {
        window.addEventListener("keydown", event =>  {
            const key = event.code.split("")[event.code.length - 1]
            event.preventDefault()

            if (!event.shiftKey && !event.ctrlKey && !event.altKey) {
                if (+key > 0 && +key <= 9 && selectionStore.selectedCells.length) {
                    emitter.emit("input-number", key)
                }
            }

            if (event.shiftKey && !event.ctrlKey && !event.altKey) {
                globalStore.setActiveNumpad("corners")

                if (+key > 0 && +key <= 9 && selectionStore.selectedCells.length) {
                    emitter.emit("input-corners", key)
                }
            }

            if (event.ctrlKey && !event.shiftKey && !event.altKey) {
                globalStore.setActiveNumpad("centers")

                if (+key > 0 && +key <= 9 && selectionStore.selectedCells.length) {
                    emitter.emit("input-centers", key)
                }
            }

            if (event.ctrlKey && event.shiftKey && !event.altKey) {
                globalStore.setActiveNumpad("colors")

                if (+key > 0 && +key <= 9 && selectionStore.selectedCells.length) {
                    emitter.emit("input-colors", key)
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
