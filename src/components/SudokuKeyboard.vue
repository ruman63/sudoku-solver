<template>
    <div class="sudoku-keyboard grid _3x">
        <div class="key clickable" :class="{'selected': currentValue === choice, 'span-row': choice === ''}"
        v-for="choice in values" :key="choice" 
        v-text="choice === '' ? 'Reset' : choice" @click="choose(choice)"
        ></div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            currentValue: null,
            values: [1, 2, 3, 4, 5, 6, 7, 8, 9, ''],
        }
    },
    methods: {
        choose(value) {
            this.$emit('input', value);
        },
        start(currentValue) {
            this.currentValue = currentValue;
        }
    },
    created() {
        this.$parent.$on('setInput', this.start)
    }
}
</script>
