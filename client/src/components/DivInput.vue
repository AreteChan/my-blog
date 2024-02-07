<template>
  <!-- contenteditable 可编辑 -->
  <div type="text" :placeholder="placeholder" contenteditable="true" class="divInput outline-none bg-gray-100 w-full p-2 rounded-lg"></div>
</template>

<script setup>
const prop = defineProps({
  placeholder: {
    type: String,
    default: 'Enter换行'
  }
})
</script>

<style scoped>
.divInput:empty::before {
  content: attr(placeholder);
  color: rgb(156 163 175);
}
</style>