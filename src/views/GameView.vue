<template>
    <GameField/>
    <GameRules/>
    <GameControls/>
    <GameWinPopup/>
</template>

<script setup lang="ts">
import GameField from "@/components/GameField.vue"
import GameRules from "@/components/GameRules.vue";
import GameControls from "@/components/GameControls.vue";
import GameWinPopup from "@/components/GameWinPopup.vue";
</script>
