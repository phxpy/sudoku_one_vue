import { defineStore } from 'pinia'

export const useGlobalStore = defineStore("global", {
    state(){
        return {
            activeNumpad: "numbers"
        }
    },
    actions: {
        setActiveNumpad(numpadName: string): void {
            this.activeNumpad = numpadName
        }
    }
})
