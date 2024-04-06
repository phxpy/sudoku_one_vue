<template>
    <div class="field" @mousedown="selectionStore.selectCell">
        <ul class="field__box" v-for="n in 9" :key="`box-${n}`">
            <GameFieldCell
                v-for="(cellNumber, index) in sudokuBoxEmpty.slice((n-1)*9, (n-1)*9+9)" :key="`${index}-${n}`"
                :hardwired="+cellNumber > 0"
                :cellIndex="index + (n-1)*9 + 1"
                :cellValue="+cellNumber > 0 ? cellNumber : ''"
            >
            </GameFieldCell>
        </ul>
    </div>
</template>

<script setup lang="ts">
    import { onMounted } from "vue";
    import GameFieldCell from "./GameFieldCell.vue"
    import { useSelectionStore } from "@/store/selection"

    const selectionStore = useSelectionStore()

    onMounted(() => {
        selectionStore.initializeCells()
    })

    const sudokuBoxEmpty = "530600098070195000000000060800400700060803020003001006060000000000419080280005079"
    // const sudokuSetEmpty = "405080100209070800701090500806070900105080700307010600509040700306050400804030200"
    // const sudokuSetFull = "813726549276954831594183762139572486768349125452861397627418953385297614941635270"
</script>

<style lang="scss">
    .field {
        align-self: center;
        justify-self: center;
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
