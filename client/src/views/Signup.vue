<script setup>
  import axios from '../utils/axios'
  import { useRouter }  from 'vue-router'
  import state from '../store'
  const router = useRouter()

  function signup() {
    if (password.value !== passwordConfirm.value) {
      alert('两次输入的密码不一致')
      return
    }
    
    if (username.value && email.value && password.value && passwordConfirm.value) {
      axios.post('/signup', {
        name: username.value,
        email: email.value,
        password: password.value,
      }).then(res => {
        console.log(res)
        state.login(res.user)
        router.push('/home')
      }).catch(err => {
        console.log(err)
      })
    }
  }
</script>

<template>
  <div class="h-5/6 flex justify-center items-center">
    <form class=" bg-white rounded-lg p-8 shadow-lg flex flex-col items-center">
      <!-- <h1 class="text-center font-bold text-4xl">登录</h1> -->
      <input id="username" type="text" class="input" placeholder="用户名" required>
      <input id="email" type="text" class="input" placeholder="邮箱" required>
      <input id="password" type="password" class="input" placeholder="密码" required> 
      <input id="passwordConfirm" type="password" class="input" placeholder="再次输入密码" required> 
      <button @click="signup" class="bg-sky-400 w-16 h-8 m-2 rounded-md text-white" type="button">注册</button>
    </form>
  </div>
</template>

<style scoped>
.input {
  @apply h-8 border-2 p-2 m-1.5 border-slate-300 focus:outline-none focus:border-sky-500 rounded-md
}
</style>

