<template>
<div>
    <div class="loader" v-if="isSolving"></div>
    <div is="transition-group" name="sudoku-grid" class="grid _9x1 main">
        <div class="grid _1x9 row" v-for="(rows, i) in board" :key="`row${i}`">
            <div class="cell clickable" 
                :class="{'selected' : editingCell.i === i && editingCell.j === j}"
                v-for="(cell, j) in rows" :key="`[${i}, ${j}]`" 
                v-text="board[i][j] == 0 ? '' : board[i][j]"
                @click="input(i, j)"></div>
        </div>
    </div>
    <transition name="scale">
        <SudokuKeyboard v-if="isEditing" @input="setCell"></SudokuKeyboard>
    </transition>
    <div class="level">
        <button class="reset-btn" @click="reset">Reset</button>
        <button class="solve-btn" @click="beginSolution">Solve</button>
    </div>
</div>
</template>
<script>
import SudokuKeyboard from './SudokuKeyboard';
export default {
    components: { SudokuKeyboard },
    data() {
        return {
            isEditing: false,
            isSolving: false,
            editingCell: {i: -1, j: -1},
            board: [
                [0,0,1,0,0,0,0,0,0],
                [0,0,0,0,2,0,0,0,0],
                [0,0,0,0,0,0,0,3,0],

                [0,0,0,0,0,0,0,0,0],
                [0,4,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0],
                
                [0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0],
            ],
        }
    },
    methods: {
        getCellValue(cell) {
            return this.board[cell.row][cell.column];
        },
        setCellValue(cell, val) {
            this.$set(this.board[cell.row], cell.column, val);
        },
        reset() {
            this.board = this.board.map(r => r.fill(0));
        },
        validateProblem() {
            let filledCells = this.board.flatMap((row,i) => row.map((cell,j) => ({row:i, column:j, val:cell}))).filter(({val}) => val !== 0);
            return filledCells.every(({row, column, val}) => this.isValid({row, column}))
        },
        isValid(cell) {
            let value = this.getCellValue(cell);
            this.setCellValue(cell, 0);
            let valid = this.checkValue(cell.row, cell.column, value);
            this.setCellValue(cell, value);
            return valid;
        },
        beginSolution() {
            if (!this.validateProblem()) {
                alert('Please provide a valid problem!');
                return true;
            } 
            this.isSolving = true;
            this.solve().then((i) => {
                console.log(`Solved after ${i} iterations`);
                this.isSolving = false;
            })
        },
        findValue(cell) {
            let selectedValue = this.getCellValue(cell) + 1;
            while( selectedValue < 10 && this.checkValue(cell.row, cell.column, selectedValue) ) {
                selectedValue++;
            }
            return selectedValue < 10 ? selectedValue : false;
        },
        solve() {
            return new Promise((res, rej) => setTimeout(() => {
                let cells = this.findEmptyCells();
                let iterations = 0;
                for(let i=0; i < cells.length; iterations++ ) {
                    if (i < 0) { //reached the depth of backtracking.
                        rej(iterations); //coudn't find a solution probably the sudoku was wrong.
                    }

                    let selectedValue = this.getCellValue(cells[i]) + 1;
                    let found = false;
                    while( selectedValue < 10 && !found ) {
                        if(this.checkValue(cells[i].row, cells[i].column, selectedValue)) {
                            found = true;
                            this.setCellValue(cells[i], selectedValue);
                            i++
                        } else {
                            selectedValue++;
                        }
                    }

                    if (!found) { // Couldn't find any value, time to backtrack
                        this.setCellValue(cells[i], 0);
                        i--;
                    }
                }
                res(iterations);
            }, 1000) );
        },
        input(i, j) {
            if(this.isEditing) {
                this.editingCell.i = -1;
                this.editingCell.j = -1;
                this.isEditing = false;
            } else {
                this.editingCell.i = i;
                this.editingCell.j = j;
                this.isEditing = true;
            }
        },
        setCell(value) {
            this.board[this.editingCell.i][this.editingCell.j] = value === '' ? 0 : value;
            this.editingCell.i = -1; 
            this.editingCell.j = -1;
            this.isEditing = false;
        },
        findEmptyCells() {
            let positions = [];
            this.board.forEach((r,i) => r.forEach((c,j) => c === 0 ? positions.push({row:i, column:j}) : '' ));
            return positions;
        },
        checkRow(row, value) {
            return this.board[row].every(cell => cell !== value);
        },
        checkColumn(column, value) {
            return this.board.every(row => row[column] !== value);
        },
        checkSquare(row, column, value) {
            let boxR = Math.floor(row/3);
            let boxC = Math.floor(column/3);

            return this.board.slice(boxR*3, (boxR+1)*3 )
                .map(row => row.slice(boxC*3, (boxC+1)*3) )
                .every(row => row.every(cell => cell !== value) )
        },
        checkValue(row, column,value) {
            return [
                this.checkRow(row, value), 
                this.checkColumn(column, value), 
                this.checkSquare(row, column, value)
            ].every(e => e);
        }
    },
    mounted() {
        console.log(this.checkRow(0, 1));
        console.log(this.checkColumn(0, 1));
        console.log(this.checkSquare(0, 0, 1));
        console.log(this.checkValue(0, 0, 1));
    }
}
</script>