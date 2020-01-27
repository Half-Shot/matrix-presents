<template>
    <button :disabled="disabled" @click="click">
        <slot/>
    </button>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
})
export default class SlideCard extends Vue {
    @Prop() private disabled!: boolean;
    @Prop() private click!: VoidFunction;
}
</script>

<style lang="scss" scoped>
button {
    border: 1px solid $color-primary-0;
    border-radius: 2px;
    padding: 5px;
    background: $color-secondary-1-2;
}

button:disabled {
    background: $color-secondary-1-3;
    border: 1px solid $color-primary-4;
    color: $color-secondary-1-4;
}
</style>