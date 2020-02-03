<template>
    <button :disabled="disabled" :title="title" @click="onClick">
        <slot/>
    </button>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
})
export default class ActionButton extends Vue {
    @Prop() private disabled!: boolean;
    @Prop() private click?: VoidFunction;
    @Prop() private to?: string;
    @Prop() private title?: string;

    private onClick() {
        if (this.click) {
            this.click();
        }
        if (this.to) {
            this.$router.push(this.to);
        }
    }
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