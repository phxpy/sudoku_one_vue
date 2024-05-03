import { defineStore } from 'pinia'

export const useGlobalStore = defineStore("global", {
    state(){
        return {
            sudokuSet: "530600098070195000000000060800400700060803020003001006060000000000419080280005079",
            isSolutionCorrect: true,
            activeNumpad: "numbers"
        }
    },
    actions: {
        setActiveNumpad(numpadName: string): void {
            this.activeNumpad = numpadName
        },
        chunkString(str: string, size: number) {
            const result:string[] = []
            for (let i = 0; i < str.length; i += size) {
                const chunk: string = str.slice(i, i + size);
                result.push(chunk);
            }
            return result
        },
        checkBoxes() {
            const boxes = this.chunkString(this.sudokuSet, 9)
            const boxSet = new Set()

            for (let i = 0; i < boxes!.length; i++) {
                const box = boxes![i]
                for (let j = 0; j < box.length; j++) {
                    if (+box[j] >= 1 && +box[j] <= 9) {
                        boxSet.add(box[j])
                        continue
                    } else {
                        this.isSolutionCorrect = false
                        break
                    }
                }
                if (boxSet.size !== 9) {
                    this.isSolutionCorrect = false
                    break
                }
            }
        },
        checkRows() {
            const boxes = this.chunkString(this.sudokuSet, 9)
            const rows = []

            for (const rowNum of [1, 4, 7]) {
                const rowTop = boxes![+rowNum - 1].slice(0, 3) + boxes![+rowNum].slice(0, 3) + boxes![+rowNum + 1].slice(0, 3)
                const rowMiddle = boxes![+rowNum - 1].slice(3, 6) + boxes![+rowNum].slice(3, 6) + boxes![+rowNum + 1].slice(3, 6)
                const rowBottom = boxes![+rowNum - 1].slice(6) + boxes![+rowNum].slice(6) + boxes![+rowNum + 1].slice(6)
                rows.push(rowTop, rowMiddle, rowBottom)

                for (let i = 0; i < rows.length; i++) {
                    if (rows[i].includes("0") || rows[i].length !== new Set(rows[i]).size) {
                        this.isSolutionCorrect = false
                    }
                }
            }

        },
        checkSolution(): void {

        }
    }
})
