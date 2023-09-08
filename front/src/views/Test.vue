<script setup>
import { ref } from 'vue'
import Modal from '../components/Modal.vue'

const draftModal = ref(null)

function openModal() {
  draftModal.value.openModal()
}

</script>

<template>
  <div class="container px-20 py-4 flexCenter">
    <button @click="openModal">openModal</button>
    <Modal ref="draftModal"></Modal>
  </div>
</template>

<style scoped>

</style>