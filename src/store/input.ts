import { defineStore } from 'pinia'
import { useSelectionStore } from "@/store/selection";
import type { FieldCell } from "@/store/selection";

export const useInputStore = defineStore("input", {
    state(){
        return {
            selection: useSelectionStore()
        }
    },
    actions: {
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
