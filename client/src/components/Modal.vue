<script setup>
import { ref } from 'vue'

const fadeBG = ref(null)
const modal = ref(null)

const props = defineProps({
  confirm: {
    type: Boolean,
    default: true
  }
})

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
    <div v-if="confirm === true" class="absolute bottom-4 right-4">
      <button>取消</button>
      <button>确定</button>
    </div>
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
  padding: 1rem;
  display: none;
  overflow: auto;
  max-height: 800px;
  max-width: 1500px;
  min-height: 100px;
  min-width: 200px;
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
