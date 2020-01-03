<template>
  <div class="slide-wrapper">  
    <SlideRoom :roomId=$route.params.roomId />
  </div>
</template>

<script>
// @ is an alias to /src
import SlideRoom from '@/components/SlideRoom.vue'

export default {
  name: "slides",
  components: {
    SlideRoom,
  },
}
</script>
