<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  imgName: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  }
})

const router = useRouter()

function linkToApp() {
  router.push(`/applets/${props.link}`)
}
</script>

<template>
  <div class="card" @click="linkToApp">
    <div class="image h-3/4">
      <img :src="`src/assets/${props.imgName}`" class="h-full w-full object-cover rounded-lg">
    </div>
    <div class="title h-1/4">
      <h2 class="title">{{ props.title }}</h2>
    </div>
  </div>
</template>

<style scoped>
.card {
  @apply h-48 w-1/6 p-2 m-4
   bg-white rounded-lg drop-shadow-lg cursor-pointer 
   hover:translate-y-4 transition-all duration-300
}

.title {
  line-height: 3rem;
  vertical-align: middle;
  text-align: center;
}
</style>