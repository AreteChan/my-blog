<script setup>
import { ref } from 'vue'

const fadeBG = ref(null)
const modal = ref(null)

function closeModal() {
  fadeBG.value.style.display = 'none'
  modal.value.style.display = 'none'
}

function openModal() {
  fadeBG.value.style.display = 'block'
  modal.value.style.display = 'flex'
}

// 暴露方法
defineExpose({ openModal, closeModal })
</script>

<template>
  <div class="fade-bg" ref="fadeBG"></div>
  <div class="modal" ref="modal">
    <button class="closeBtn" @click="closeModal">X</button>
    <slot></slot>
  </div>
</template>

<style scoped>
.fade-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  z-index: 1;
  display: none;
}

.modal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  z-index: 2;
  border-radius: 0.5rem;
  padding: 2rem;
  display: none;
  overflow: auto;
  max-height: 800px;
  max-width: 1500px;
}

.closeBtn {
  position: absolute;
  top: 0.5rem;
  right: 1rem;
  border: none;
  outline: none;
  background: none;
  font-size: 1.5rem;
  color: #aaa;
}
</style>
