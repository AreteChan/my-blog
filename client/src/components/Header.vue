<script setup>
  import axios from 'axios'
  import state from '../store'
  import { useRouter, useRoute } from 'vue-router'

  const router = useRouter()

  const btns = [
    { name: '首页', path: '/' },
    { name: '数据', path: '/data' },
    { name: '应用', path: '/applets' },
  ]

  function logout() {
    axios.get('/logout').then(res => {
      console.log(res)
      state.logout()
      router.push('/home')
    }).catch(err => {
      console.log(err)
    })
  }

</script>

<template>
  <div id="header" class="bg-white px-6 h-12 w-full shadow flex justify-between">
    <div class="left flex items-center">
      <template v-if="state.isAuth">
        <span class="mx-12 px-3 h-8 rounded-lg bg-blue-200 font-bold flex items-center">
          {{ state.username }}
        </span>
      </template>
    </div>
    <div class="right h-full mx-12 flex items-center">
      <button class="btn font-bold text-gray-500" 
        v-for="btn in btns" 
        :key="btn.name" 
        @click="router.push(btn.path)">
        {{ btn.name }}
      </button>
      <template v-if="state.role === 'admin'">
        <button class="btn font-bold text-gray-500" @click="router.push('/writing')">写作</button>
      </template>
      <template v-if="!state.isAuth">
        <button class="btn font-bold text-gray-500" @click="router.push('/login')">登录</button>
      </template>
      <template v-else>
        <button class="btn font-bold text-gray-500" @click="logout">退出登录</button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.btn {
  @apply h-10 px-5 hover:bg-slate-100 rounded-md transition-all duration-300
}
</style>