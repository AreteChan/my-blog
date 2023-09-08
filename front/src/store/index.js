import { reactive } from "vue"

const state = reactive({
  isAuth: localStorage.getItem('username') ? true : false,
  username: localStorage.getItem('username') || undefined,
  userId: localStorage.getItem('userId') || undefined,
  role: localStorage.getItem('role') || undefined,

  login(user) {
    localStorage.setItem('username', user.name)
    localStorage.setItem('userId', user._id)
    localStorage.setItem('role', user.role)
    this.username = user.name
    this.userId = user._id
    this.role = user.role
    this.isAuth = true
  },

  logout() {
    localStorage.removeItem('username')
    localStorage.removeItem('userId')
    localStorage.removeItem('role')
    this.username = undefined
    this.userId = undefined
    this.role = undefined
    this.isAuth = false

  }
})

export default state