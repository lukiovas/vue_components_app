<template>
  <div class="home">

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import components from '@/components/components.vue'; // @ is an alias to /src

@Component({
  components: {
    components,
  },
})
export default class Home extends Vue {}
</script>
