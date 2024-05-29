import { defineStore } from "pinia"

export const useGlobalStore = defineStore("global", {
    state(){
        return {
            sudokuSet: "530600098070195000000000060800400700060803020003001006060000000000419080280005079",
            sudokuSize: 9,
            isSolutionCorrect: false,
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
        checkBoxes():void {
            const boxes:string[] = this.chunkString(this.sudokuSet, this.sudokuSize)

            for (let i = 0; i < boxes!.length; i++) {
                const boxSet = new Set(boxes[i])
                if (boxSet.size !== boxes[i].length) {
                    this.isSolutionCorrect = false
                    console.log("incorrect");
                    return
                }
            }

            this.isSolutionCorrect = true
            console.log("correct");
        },
        checkRows():void {
            const boxes:string[] = this.chunkString(this.sudokuSet, this.sudokuSize)
            const rows:string[] = []

            for (let i = 0; i < boxes!.length; i+=3) {
                for (let j = 0; j < 3; j++) {
                    rows.push(boxes[i].slice(3*j, 3*j+3) + boxes[i+1].slice(3*j, 3*j+3) + boxes[i+2].slice(3*j, 3*j+3))
                }
            }

            for (let i = 0; i < rows.length; i++) {
                const rowSet = new Set(rows[i])
                if (rowSet.size !== rows[i].length) {
                    this.isSolutionCorrect = false
                    console.log("incorrect");
                    return
                }
            }

            this.isSolutionCorrect = true
            console.log("correct");
        },
        checkSolution(): void {
            this.checkRows()
        }
    }
})
