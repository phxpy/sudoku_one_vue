<template>
    <dialog class="popup" ref="dialog">
        <template v-if="globalStore.isSolutionCorrect">
            <h2 class="popup__heading">Congrats!</h2>
            <p class="popup__text">Good job!</p>
            <button class="btn popup__btn" @click="closeDialog">woo-hoo</button>
        </template>
        <template v-else>
            <h2 class="popup__heading">Nope...</h2>
            <p class="popup__text">Try one more time</p>
            <p class="popup__text">There are some mistakes in the puzzle</p>
            <button class="btn popup__btn" @click="closeDialog">let's see</button>
        </template>
    </dialog>
</template>

<script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import { useGlobalStore } from '@/store/global';
    import emitter from '@/eventbus';

    const globalStore = useGlobalStore()
    const dialog = ref<HTMLDialogElement | null>(null)

    const closeDialog = () => {
        dialog.value!.close()
    }

    onMounted(() => {
        emitter.on("raise-popup", () => {
            dialog.value!.showModal()
        })
    })
</script>

<style lang="scss">
    .popup[open] {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 10px;
        padding: 20px 50px;
        overflow: hidden;
    }

    .popup::backdrop {
        background-color: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(7px);
    }

    .popup__btn {
        position: relative;
        width: 100%;
        padding: 5px 20px;
        font-size: 20px;
        color: #fff;
        background-color: #7fc96b;
        border: none;
        border-radius: 5px;

        &:hover {
            background-color: #6eaf5c;
        }
    }
</style>
