import { defineStore } from 'pinia'

export const useSelectionStore = defineStore("selection", {
    state: () => {
        return {
            selectedCells: [] as HTMLLIElement[],
            isDeselectionMode: false as boolean,
            allCells: [] as HTMLLIElement[]
        }
    },
    actions: {
        addCell(cell: HTMLLIElement) {
            this.selectedCells.push(cell)
        },
        removeCell() {
            this.selectedCells = this.selectedCells.filter(cell => {
                return cell.classList.contains("field__cell--active")
            })
        },
        restoreToDefaults(): void {
            for (let i = 0; i < this.selectedCells.length; i++) {
                this.selectedCells[i].classList.remove("field__cell--active")
                if (this.selectedCells[i].classList.contains("field__cell--one-active")) {
                    this.selectedCells[i].classList.remove("field__cell--one-active")
                }
            }
            this.selectedCells = []
        },
        selectCell(event: any): void {
            this.restoreToDefaults()
            const cell: HTMLLIElement = event.target.closest(".field__cell")

            if (cell) {
                if (!cell.classList.contains("field__cell--active") || this.selectedCells.length > 1) {
                    cell.classList.add("field__cell--one-active")
                    this.addCell(cell)
                } else if (cell.classList.contains("field__cell--active")) {
                    cell.classList.remove("field__cell--active")
                    this.removeCell()
                }
            }

            document.querySelector(".field")!.addEventListener("mousemove", this.selectMultipleCells)

            window.addEventListener("mouseup", () => {
                document.querySelector(".field")!.removeEventListener("mousemove", this.selectMultipleCells)
                this.isDeselectionMode = false
            })
        },
        selectMultipleCells(event: any): void {
            const cell = event.target.closest(".field__cell")

            if (document.querySelector(".field__cell--one-active")) {
                document.querySelector(".field__cell--one-active")!.classList.add("field__cell--active")
                document.querySelector(".field__cell--one-active")!.classList.remove("field__cell--one-active")
            }

            if (
                cell &&
                !this.isDeselectionMode &&
                !cell.classList.contains("field__cell--active") &&
                event.target.classList.contains("field__cell-hovercell")
            )
                {
                    cell.classList.add("field__cell--active")
                    this.addCell(cell)
            } else if (
                cell &&
                this.isDeselectionMode &&
                cell.classList.contains("field__cell--active") &&
                event.target.classList.contains("field__cell-hovercell")
            )
                {
                    cell.classList.remove("field__cell--active")
                    this.removeCell()
            }
        }
    }
})
