<template>
  <div class="slide-wrapper">  
    <Slide/>
  </div>
</template>

<script>
// @ is an alias to /src
import Slide from '@/components/Slide.vue'

export default {
  name: "slides",
  components: {
    Slide,
  },
}
</script>
