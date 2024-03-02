<template>
    <div class="field" @mousedown="store.selectCell">
        <ul class="field__box" v-for="n in 9" :key="`box-${n}`">
            <FieldCell
                v-for="cellNumber, index in sudokuBoxEmpty.slice((n-1)*9, (n-1)*9+9)" :key="`${index}-${cellNumber}`"
                :hardwired="+cellNumber > 0"
                :cellIndex="index + (n-1)*9 + 1"
            >
                {{ +cellNumber > 0 ? cellNumber : "" }}
            </FieldCell>
        </ul>
    </div>
</template>

<script setup lang="ts">
    import FieldCell from "./FieldCell.vue"
    import { useGameStore } from "@/store/game"

    const store = useGameStore()

    const sudokuBoxEmpty = "530600098070195000000000060800400700060803020003001006060000000000419080280005079"
    // const sudokuSetEmpty = "405080100209070800701090500806070900105080700307010600509040700306050400804030200"
    // const sudokuSetFull = "813726549276954831594183762139572486768349125452861397627418953385297614941635270"
</script>

<style>
@import "../assets/styles/field.css"
</style>
