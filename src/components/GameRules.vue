<template>
    <div class="rules">
        <h1 class="rules__title">{{ globalStore.puzzle.name }}<br>by author</h1>
        <p class="rules__text">{{ globalStore.puzzle.rules }}</p>
    </div>
</template>

<script setup lang="ts">
    import { useGlobalStore } from "@/store/global";

    const globalStore = useGlobalStore()
</script>

<style lang="scss">
    .rules {
        grid-column: 2;
        grid-row: 1;
        align-self: end;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        height: 100%;
        background-color: #ddd;
        border-radius: 5px;
        overflow: hidden;
    }

    .rules__title {
        padding: 10px;
        font-size: 16px;
        font-weight: 700;
        line-height: 1;
        background-color: #eee;
    }

    .rules__text {
        flex-grow: 1;
        height: 0;
        max-height: 100%;
        padding: 10px;
        font-size: 16px;
        overflow-y: auto;
    }
</style>
