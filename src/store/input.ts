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

interface NumpadTextNode extends HTMLElement {
    textContent: string
}

export const useInputStore = defineStore("input", {
    state(){
        return {
            selection: useSelectionStore(),
            COLORS
        }
    },
    actions: {
        inputNumpadValue($event: MouseEvent) {
            switch (useGlobalStore().activeNumpad) {
                case "numbers":
                    this.inputNumber($event)
                    break
                case "corners":
                    this.inputCorners($event)
                    break
                case "centers":
                    this.inputCenters($event)
                    break
                case "colors":
                    this.colorCells($event)
                    break
            }
        },
        inputNumber(e: KeyboardEvent | MouseEvent) {
            let key: string

            if (e instanceof KeyboardEvent) {
                key = e.key
            } else {
                const divBtn = e.target as NumpadBtn
                key = divBtn.textContent
            }

            if (this.selection.selectedCells.length) {
                this.selection.selectedCells.forEach(cell => {
                    if (!cell.classList.contains("field__cell--hardwired")) {
                        cell.querySelector(".field__cell-corners")!.textContent = ""
                        cell.querySelector(".field__cell-centers")!.textContent = ""
                        cell.querySelector(".field__cell-number")!.textContent = key

                        if (cell.cornerMarks) {
                            cell.cornerMarks = []
                        }
                        if (cell.centerMarks) {
                            cell.centerMarks = []
                        }
                    }
                })
            }
        },
        // input corner marks
        inputCorners(e: KeyboardEvent | MouseEvent) {
            let key: string

            if (e instanceof KeyboardEvent) {
                key = e.code.split("")[e.code.length - 1]
            } else {
                const numBtn = e.target as NumpadBtn
                const numTextNode = numBtn.closest(".numpad__btn").firstElementChild as NumpadTextNode
                key = numTextNode.textContent
            }

            this.selection.selectedCells.forEach(cell => {
                if (!cell.classList.contains("field__cell--hardwired")) {

                    const corners = cell.querySelector(".field__cell-corners")!

                    if (cell.cornerMarks && cell.cornerMarks.length && cell.cornerMarks.includes(+key)) {
                        const mark = Array.from(corners.children).find(item => {
                            return item.classList.contains(`field__cell-corner-mark--${key}`)
                        })
                        mark!.remove()
                        cell.cornerMarks.splice(cell.cornerMarks.indexOf(+key), 1)
                    } else {
                        if (!cell.cornerMarks) cell.cornerMarks = []
                        if (cell.centerMarks) cell.centerMarks = []

                        cell.querySelector(".field__cell-number")!.textContent = ""
                        cell.querySelector(".field__cell-centers")!.textContent = ""

                        const span = document.createElement("span")
                        span.classList.add("field__cell-corner-mark", `field__cell-corner-mark--${key}`)
                        span.textContent = key
                        cell.querySelector(".field__cell-number")!.textContent = ""
                        corners.append(span)
                        cell.cornerMarks.push(+key)
                    }
                }
            })
        },
        inputCenters(e: MouseEvent | KeyboardEvent) {
            let key: string

            if (e instanceof KeyboardEvent) {
                key = e.code.split("")[e.code.length - 1]
            } else {
                const numBtn = e.target as NumpadBtn
                const numTextNode = numBtn.closest(".numpad__btn").firstElementChild as NumpadTextNode
                key = numTextNode.textContent
            }

            this.selection.selectedCells.forEach(cell => {
                if (!cell.classList.contains("field__cell--hardwired")) {
                    const centers: FieldCell = cell.querySelector(".field__cell-centers")!

                    if (cell.centerMarks && cell.centerMarks.includes(+key)) {
                        const cornersArr: number[] = [...centers.textContent]
                        cornersArr.splice(centers.textContent.indexOf(key), 1)
                        centers.textContent = cornersArr.join("")
                        cell.centerMarks.splice(cell.centerMarks.indexOf(+key), 1)
                    } else {
                        if (!cell.centerMarks) cell.centerMarks = []
                        if (cell.cornerMarks) cell.cornerMarks = []

                        cell.querySelector(".field__cell-number")!.textContent = ""
                        cell.querySelector(".field__cell-corners")!.textContent = ""

                        cell.centerMarks.push(+key)
                        cell.centerMarks.sort()

                        centers.textContent = ""
                        for (let i = 0; i < cell.centerMarks.length; i++) {
                            centers.textContent += cell.centerMarks[i]
                        }
                    }
                }
            })
        },
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
        deleteCell(): void {
            this.selection.selectedCells.forEach(cell => {
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
    }
})
