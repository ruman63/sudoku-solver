<template>
    <div class="wrapper">
        <h1 style="text-alignment: center;">Sudoku Solver</h1>
        <Sudoku></Sudoku>
    </div>
</template>
<script>
import Sudoku from './components/Sudoku';
export default {
    components: {Sudoku}
}
</script>
<style lang="css" src="./assets/app.css"></style>