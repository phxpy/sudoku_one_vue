<template>
    <li class="field__cell" :class="{'field__cell--hardwired': hardwired}" :data-num="cellIndex">
        <div class="field__cell-inner field__cell-number">
            <slot></slot>
        </div>
        <div class="field__cell-inner field__cell-borders"></div>
        <div class="field__cell-inner field__cell-corners"></div>
        <div class="field__cell-inner field__cell-centers"></div>
        <div class="field__cell-hovercell"></div>
    </li>
</template>

<script setup lang="ts">
    defineProps<{
        hardwired: Boolean,
        cellIndex: Number
    }>()
</script>
