<template>
  <div class="home">

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import components from '@/components/components.vue';
import properties from '@/components/properties.vue';
import templates from '@/components/templates.vue';
import modules from '@/components/modules.vue';
import projects from '@/components/projects.vue';


@Component({
  components: {
    components,
  },
})

export default class Home extends Vue {}



</script>
