import { defineStore } from 'pinia'
import { useGlobalStore } from "@/store/global";
import { useSelectionStore } from "@/store/selection";
import type { FieldCell } from "@/store/selection";
import { COLORS } from "@/store/enums";

interface NumpadBtn extends HTMLElement {
    closest(cls: string): HTMLElement,
    firstElementChild: HTMLElement,
    textContent: string,
}

export const useInputStore = defineStore("input", {
    state(){
        return {
            selection: useSelectionStore(),
            COLORS
        }
    },
    actions: {
        colorCells(e: MouseEvent | KeyboardEvent) {
            let color: string

            if (e instanceof KeyboardEvent) {
                const key = +e.code.split("")[e.code.length - 1]
                color = this.COLORS[key]
            } else {
                const numBtn = e.target as NumpadBtn
                const numColor = numBtn.closest(".numpad__btn").firstElementChild!.firstElementChild as HTMLInputElement
                color = numColor.value
            }

            this.selection.selectedCells.forEach((cell: FieldCell): void => {
                if (cell.bgColors.indexOf(color) === -1) {
                    cell.bgColors.push(color)
                } else {
                    cell.bgColors.splice(cell.bgColors.indexOf(color), 1)
                }
                if (cell.bgColors.length > 1) {
                    cell.bgColors.sort()
                    const percent:number = +(100 / cell.bgColors.length).toFixed(2)
                    let colorStr = `${cell.bgColors[0]} ${percent}%`
                    for (let i = 1; i < cell.bgColors.length; i++) {
                        if (i !== cell.bgColors.length - 1) {
                            colorStr += `, ${cell.bgColors[i]} ${percent}%, ${cell.bgColors[i]} ${percent * (i + 1)}%`
                        } else {
                            colorStr += `, ${cell.bgColors[i]} ${percent * i}%`
                        }
                    }
                    cell.style.backgroundColor = "#fff"
                    cell.style.backgroundImage = `conic-gradient(from 30deg, ${colorStr})`
                } else if (cell.bgColors.length === 1 && cell.style.backgroundImage.startsWith("conic")) {
                    cell.style.backgroundImage = "none"
                    cell.style.backgroundColor = `${cell.bgColors[0]}`
                    cell.bgColors = []
                } else {
                    cell.style.backgroundImage = "none"
                    cell.style.backgroundColor = `${color}`
                }
            })
        },
        deleteCell(refresh: boolean = false): void {
            let cells = [] as FieldCell[]

            if (refresh) {
                cells = this.selection.allCells
            } else {
                cells = this.selection.selectedCells
            }

            cells.forEach(cell => {
                if (!cell.classList.contains("field__cell--hardwired")) {
                    if (cell.querySelector(".field__cell-number")!.textContent) {
                        cell.querySelector(".field__cell-number")!.textContent = ""
                    } else if (cell.querySelector(".field__cell-corners")!.textContent) {
                        cell.querySelector(".field__cell-corners")!.textContent = ""
                        if (cell.cornerMarks) {
                            cell.cornerMarks = []
                        }
                    } else if (cell.querySelector(".field__cell-centers")!.textContent) {
                        cell.querySelector(".field__cell-centers")!.textContent = ""
                        if (cell.centerMarks) {
                            cell.centerMarks = []
                        }
                    } else {
                        cell.style.backgroundColor = "#fff"
                        cell.style.backgroundImage = "none"
                        cell.bgColors = []
                    }
                } else {
                    cell.style.backgroundColor = "#fff"
                    cell.style.backgroundImage = "none"
                    cell.bgColors = []
                }
            })
        },
        refresh(): void {
            this.deleteCell(true)
        }
    }
})
