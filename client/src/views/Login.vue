<script setup>
import axios from '../utils/axios'
import state from '../store'
import { useRouter }  from 'vue-router'
const router = useRouter()

function login() {
  if (email.value && password.value) {
    axios.post('/login', {
      email: email.value,
      password: password.value
    }).then(res => {
      console.log(res)
      state.login(res.user)
      router.push('/home')
    }).catch(err => {
      console.log(err)
      alert('登录失败！请检查邮箱和密码是否正确！')
    })
  }
}
</script>

<template>
  <div class="h-5/6 flex justify-center items-center">
    <form class="h-60 bg-white rounded-lg p-8 shadow-lg flex flex-col justify-around items-center">
      <!-- <h1 class="text-center font-bold text-4xl">登录</h1> -->
      <input id="email" type="text" class="input" placeholder="邮箱" required>
      <input id="password" type="password" class="input" placeholder="密码" required> 
      <button @click="login" class="bg-sky-400 w-16 h-8 rounded-md text-white">登录</button>
      <router-link to="signup" class="text-xs underline text-sky-500">没有账号？点此注册</router-link>
    </form>
  </div>
</template>

<style scoped>
.input {
  @apply h-8 border-2 p-2 border-slate-300 focus:outline-none focus:border-sky-500 rounded-md
}
</style>