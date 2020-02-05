<template>
  <div class="create-show">
    <section>
        <h2> Basic Details </h2>
        <InputGroup :error="errors.title" label="Title" type="text" placeholder="My amazing slide" name="title" :onChange="formValueChange"/>
        <InputGroup label="Subtitle" type="text" placeholder="How I changed the world" name="subtitle" :onChange="formValueChange"/>
        <InputGroup label="Use generated alias" type="checkbox" :placeholder="`#foobar:${serverName}`" name="generate_alias" :defaultValue="true" :onChange="formValueChange"/>
        <InputGroup label="Alias"
                    type="text"
                    :placeholder="`#foobar:${serverName}`"
                    name="alias"
                    :value="formData.alias"
                    :disabled="formData.generate_alias"
                    :onChange="formValueChange"
        />
    </section>
    <section>
        <h2> Permissions </h2>
        Coming soon...
    </section>
    <section>
        <h2> Add Collaborators </h2>
        Coming soon...
    </section>
    <ActionButton :click="createShow">Create Show</ActionButton>
    <span v-if="creating">Creating room...</span>
  </div>
</template>

<style lang="scss" scoped>
.create-show {
    margin-left: 15%;
    margin-right: 15%;
    text-align: left;
}
label {
    margin-right: 8px;
}
section {
    margin-bottom: 50px;
}
</style>

<script lang="ts">
import Vue from 'vue'
import { Component } from "vue-property-decorator";
import ActionButton from "@/components/ActionButton.vue";
import InputGroup from "@/components/Forms/InputGroup.vue"
import { getClient } from '../util/matrix';

@Component({
  components: {
      ActionButton,
      InputGroup
  },
  name: "CreateSlideshow",
})
export default class Slides extends Vue {
    private errors = {
        title: ""
    }
    private formData: {
        title: string
        subtitle: string
        alias: string,
        generate_alias: boolean,
    } = {
        title: "",
        subtitle: "",
        alias: "",
        generate_alias: true
    };
    private creating = false;
    private get serverName() {
       return this.$root.$data.sharedState.userId.split(":").pop();
    }

    private beforeMount(): void {
        this.$root.$data.sharedState.pageName = "Create Slideshow";
    }

    private formValueChange(name: string, value: string) {
        (this.formData as any)[name] = value;
        if (name && this.formData.generate_alias) {
            this.formData.alias = "fooo";
        }
    }

    private async createShow() {
        if (!this.formData.title) {
            this.errors.title = "This must be specified";
            // Cannot create;
            return;
        }
        const client = getClient();
        this.creating = true;
        const {room_id} = await client.createRoom({
            room_alias_name: this.formData.alias,
            topic: this.formData.subtitle,
            name: this.formData.title,
        });
        const { event_id } = await client.sendEvent(room_id, "uk.half-shot.presents.slide", {
            title: this.formData.title,
            subtitle: this.formData.subtitle,
        });
        const stateEv = await client.sendStateEvent(room_id, "uk.half-shot.presents.slides", {
            slides: [event_id],
        }, "");
        console.log("Created new slide:", stateEv);
        this.creating = false;
        this.$router.push(`/editor/${room_id}`);
    }
}
</script>