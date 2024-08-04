<template>
    <GameView v-if="globalStore.sudokuInitialSet"/>
    <p class="error" v-else-if="error" v-html="error"></p>
</template>

<script setup lang="ts">
    import GameView from "@/views/GameView.vue"
    import { useGlobalStore } from "@/store/global";
    import { useSelectionStore } from '@/store/selection';
    import { onMounted, ref } from 'vue';
    import emitter from '@/eventbus';
    import { COLORS } from "./store/constants";

    const selectionStore = useSelectionStore()
    const globalStore = useGlobalStore()
    const error = ref("")

    onMounted(() => {
        try {
            const puzzleB64: string = new URL(location.href).searchParams.get("puzzle") || ""
            const puzzleData = atob(puzzleB64)
            globalStore.setInitialSet(JSON.parse(puzzleData).initialState)
        } catch (e) {
            error.value = "Incorrect puzzle link.<br>Try another one"
        }

        window.addEventListener("keydown", event =>  {
            const key = event.code.split("")[event.code.length - 1]
            event.preventDefault()

            if (!event.shiftKey && !event.ctrlKey && !event.altKey) {
                if (+key > 0 && +key <= 9 && selectionStore.selectedCells.length) {
                    if (globalStore.activeNumpad === "numbers") {
                        emitter.emit("input-number", key)
                    } else if (globalStore.activeNumpad === "corners") {
                        emitter.emit("input-corners", key)
                    } else if (globalStore.activeNumpad === "centers") {
                        emitter.emit("input-centers", key)
                    } else if (globalStore.activeNumpad === "colors") {
                        emitter.emit("input-color", COLORS[+key - 1])
                    }
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
                    emitter.emit("input-color", COLORS[+key - 1])
                }
            }

            if (event.altKey && !event.ctrlKey && !event.shiftKey) {
                if (+key > 0 && +key <= 9 && selectionStore.selectedCells.length) {
                    emitter.emit("mark-number", key)
                }
            }

            if ((event.key === "Delete" || event.key === "Backspace") && selectionStore.selectedCells.length) {
                emitter.emit("delete-cell")
            }
        })

        window.addEventListener("keyup", (e) => {
            if (e.key === "Control" || e.key === "Shift" || e.key === "Alt") {
                globalStore.setActiveNumpad("numbers")
            }
        })
    })
</script>
