<template>
    <span class="timer">
        <span class="timer__hours">{{ hours }}</span>
        :
        <span class="timer__minutes">{{ minutes }}</span>
        :
        <span class="timer__seconds">{{ seconds }}</span>
    </span>
</template>

<script setup lang="ts">
    import { onMounted, ref } from "vue";
    import { useGlobalStore } from "@/store/global";

    const globalStore = useGlobalStore()

    let hours = ref<string>("00")
    let minutes = ref<string>("00")
    let seconds = ref<string>("00")

    onMounted(() => {
        const timerId = setInterval(() => {
            seconds.value = String(+seconds.value + 1)
            if (+seconds.value < 10) {
                seconds.value = `0${seconds.value}`
            }
            if (+seconds.value === 60) {
                minutes.value = String(+minutes.value + 1)
                if (+minutes.value < 10) {
                    minutes.value = `0${minutes.value}`
                }
                seconds.value = "00"
            }
            if (+minutes.value === 60) {
                hours.value = String(+hours.value + 1)
                if (+hours.value < 10) {
                    hours.value = `0${hours.value}`
                }
                minutes.value = "00"
            }
        }, 1000)

        globalStore.setTimerId(timerId)
    })
</script>

<style>
    .timer {
        grid-column: 1 / -1;
        display: flex;
        align-items: center;
        font-size: 20px;
    }
</style>
