<template>
    <div class="form-group">
        <label :for="name">{{ label }}</label>
        <input ref="input" :name="name" v-model="value" :disabled="disabled" :type="type" :placeholder="placeholder" @change="(event) => onChange(name, inputValue())"/>
        <span v-if="error"> {{ error }} </span>
    </div>
</template>

<style lang="scss" scoped>
label {
    margin-right: 5px;
    width: 150px;
}
.form-group {
    margin-top: 5px;
}

span {
    color: red;
}
</style>

<script lang="ts">
import Vue from 'vue'
import { Prop, Component } from 'vue-property-decorator'
@Component({

})
export default class InputGroup extends Vue {
    @Prop() private type!: string;
    @Prop() private placeholder!: string;
    @Prop() private name!: string;
    @Prop() private label!: string;
    @Prop() private error?: string;
    @Prop() private disabled?: boolean;
    @Prop() private value: unknown;
    @Prop() private defaultValue: unknown;

    private inputValue() {
        const e = this.$refs.input as HTMLInputElement;
        if (this.type === "checkbox") {
            return e.checked;
        }
        return e.value;
    }


    private beforeMount() {
        this.value = this.defaultValue;
    }

    @Prop() private onChange!: (name: string, value: string) => void;
}
</script>