<template>
    <div class="card">
        <router-link class="link" :to="`/slides/${encodeURIComponent(room.roomId)}`">{{ room.name }}</router-link>
        <p>
            <span>
                <UsersIcon size="0.9x"/> {{ memberCount }}
            </span>
            <span v-if="!isPublic">
                <LockIcon size="0.9x"/> Private
            </span>
        </p>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Room } from 'matrix-js-sdk';
import { UsersIcon, LockIcon, UnlockIcon } from 'vue-feather-icons'

@Component({
    components: {
        UsersIcon,
        LockIcon,
        UnlockIcon,
    }
})
export default class SlideCard extends Vue {
    @Prop() private room!: Room;
    private memberCount = 0;

    private beforeMount() {
        const members = this.room.getMembersWithMembership("join");
        this.memberCount = members.length;
    }

    private get isPublic() {
        const event = this.room.getLiveTimeline().getState("f").getStateEvents("m.room.join_rules")[0];
        return event.getContent().join_rule === "public";
    }
}

</script>

<style lang="scss" scoped>
.card {
    border-radius: 2px;
    border: $color-primary-3 1px solid;
    width: 50%;
    padding: 5px;
    padding-bottom: 0px;
    background: $color-secondary-1-0;

    .link {
        text-decoration: none;
        font-weight: bold;
    }   

    .link:visited {
        color: $color-primary-3;
    }

    .link:link {
        color: $color-primary-3;
    }
}
</style>