import { defineStore } from 'pinia'

export const useGameStore = defineStore("game", {
    state: () => {
        return {
            selectedCells: [] as HTMLElement[],
            isDeselectionMode: false as boolean,
        }
    },
    actions: {
        addCell(cell: HTMLElement) {
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
            }
            this.selectedCells.length = 0
        },
        selectCell(event: any): void {
            const cell = event.target.closest(".field__cell")

            if (cell) {
                this.restoreToDefaults()
                if (!cell.classList.contains("field__cell--active") || this.selectedCells.length > 1) {
                    cell.classList.add("field__cell--active")
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
