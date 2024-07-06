import { defineStore } from "pinia"

export const useGlobalStore = defineStore("global", {
    state(){
        return {
            sudokuInitialSet: "435682197269571834781493562826374951195682743347915628519248763326957418874136250",
            // sudokuBoxEmpty: "530600098070195000000000060800400700060803020003001006060000000000419080280005079",
            sudokuUserSolution: [4,3,5,6,8,2,1,9,7,2,6,9,5,7,1,8,3,4,7,8,1,4,9,3,5,6,2,8,2,6,3,7,4,9,5,1,1,9,5,6,8,2,7,4,3,3,4,7,9,1,5,6,2,8,5,1,9,2,4,8,7,6,3,3,2,6,9,5,7,4,1,8,8,7,4,1,3,6,2,5,0],
            sudokuSize: 9,
            sudokuRows: [],
            isSolutionCorrect: false,
            activeNumpad: "numbers",
            timerId: 0
        }
    },
    actions: {
        setTimerId(id: number): void {
            this.timerId = id
        },
        setActiveNumpad(numpadName: string): void {
            this.activeNumpad = numpadName
        },
        setSolutionNumber(num: number, pos: number): void {
            this.sudokuUserSolution[pos - 1] = num
        },
        deleteSolutionNumber(pos: number): void {
            this.sudokuUserSolution[pos - 1] = 0
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
            const solutionString = this.sudokuUserSolution.join("")
            const boxes:string[] = this.chunkString(solutionString, this.sudokuSize)

            for (let i = 0; i < boxes!.length; i++) {
                const boxSet = new Set(boxes[i].split("").filter(num => num !== "0"))
                if (boxSet.size !== boxes[i].length) {
                    this.isSolutionCorrect = false
                    console.log("incorrect");
                    return
                }
            }

            this.isSolutionCorrect = true
            console.log("correct");
        },
        checkRowsAndColumns():void {
            const solutionString = this.sudokuUserSolution.join("")
            const boxes:string[] = this.chunkString(solutionString, this.sudokuSize)
            const rows:string[] = []

            for (let i = 0; i < boxes!.length; i+=3) {
                for (let j = 0; j < 3; j++) {
                    rows.push(boxes[i].slice(3*j, 3*j+3) + boxes[i+1].slice(3*j, 3*j+3) + boxes[i+2].slice(3*j, 3*j+3))
                }
            }

            for (let i = 0; i < rows.length; i++) {
                const rowSet = new Set(rows[i])
                if (rowSet.size !== rows[i].length || rows[i].includes("0")) {
                    this.isSolutionCorrect = false
                    console.log("incorrect");
                    return
                }
            }

            const columns:string[] = []
            for (let i = 0; i < 9; i++) {
                let column:string = ""
                for (let j = 0; j < rows.length; j++) {
                    column += rows[j][i]
                }
                columns.push(column)
            }

            for (let i = 0; i < columns.length; i++) {
                const columnSet = new Set(columns[i])
                if (columnSet.size !== columns[i].length || columns[i].includes("0")) {
                    this.isSolutionCorrect = false
                    console.log("incorrect");
                    return
                }
            }

            this.isSolutionCorrect = true
            console.log("correct");
            clearInterval(this.timerId)
        },
        checkSolution(): void {
            if (this.sudokuUserSolution.join("").includes("0")) {
                console.log("incorrect");
            } else {
                this.checkBoxes()
                this.checkRowsAndColumns()
            }
        }
    }
})
