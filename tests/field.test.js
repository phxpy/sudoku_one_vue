import { mount } from "@vue/test-utils"
import { test, expect, describe, beforeEach, vi } from "vitest"

import { createPinia, setActivePinia } from "pinia"
import { useGlobalStore } from "@/store/global";
import { useSelectionStore } from "@/store/selection"

import GameField from "../src/components/GameField.vue"
import GameFieldCell from "../src/components/GameFieldCell.vue"

describe("complete field rendering", () => {
    beforeEach((async () => {
        setActivePinia(createPinia())
        const globalStore = useGlobalStore()
        globalStore.puzzle.initialState = `${1e80}`
    }))

    test("render field box", () => {
        const wrapper = mount(GameField)

        expect(wrapper.get(".field").exists()).toBe(true)
        expect(wrapper.get(".field__cell").exists()).toBe(true)
    })

    test("render cells", () => {
        const wrapper = mount(GameFieldCell, {
            props: {
                hardwired: false,
                cellIndex: 5,
                cellValue: 5
            }
        })

        expect(wrapper.get(".field__cell").exists()).toBe(true)
    })
})

describe.skip("interaction with field", () => {
    beforeEach((async () => {
        setActivePinia(createPinia())
        const globalStore = useGlobalStore()
        globalStore.puzzle.initialState = `${1e80}`
    }))

    test("cell clicking", async () => {
        // const wrapper = mount(GameField)
        // await wrapper.find(".field__cell").trigger("click")
        // expect(wrapper.get(".field__cell--one-active").exists()).toBe(true)

        //----------------------------------

        const selectionStore = useSelectionStore()
        selectionStore.selectCell = vi.fn()

        const wrapper = mount(GameField)

        const cells = wrapper.findAllComponents(GameFieldCell);
        expect(cells.length).toBeGreaterThan(0);

        await cells[0].trigger("click");

        expect(selectionStore.selectCell).toHaveBeenCalled()

        console.log(cells[0].classes())
        expect(cells[0].classes()).toContain("field__cell--one-active")
    })
})
