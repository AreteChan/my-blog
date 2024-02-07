import {createRouter, createWebHashHistory} from 'vue-router'
import state from '../store'
// import Main from '../views/Main.vue'
// import Home from '../views/Home.vue'
// import Login from '../views/Login.vue'
// import Signup from '../views/Signup.vue'
// import Data from '../views/Data.vue'
// import Writing from '../views/Writing.vue'
// import Blog from '../views/Blog.vue'
// import Applets from '../views/Applets.vue'
// import BinarySearchVisualization from '../views/Applets/BinarySearchVisualization.vue'
// import Modal from '../components/Modal.vue'
// import Test from '../views/Test.vue'

const Main = () => import('../views/Main.vue')
const Home = () => import('../views/Home.vue')
const Login = () => import('../views/Login.vue')
const Signup = () => import('../views/Signup.vue')
const Data = () => import('../views/Data.vue')
const Writing = () => import('../views/Writing.vue')
const Blog = () => import('../views/Blog.vue')
const Applets = () => import('../views/Applets.vue')
const BinarySearchVisualization = () => import('../views/Applets/BinarySearchVisualization.vue')
const PokemonIndex = () => import('../views/Applets/PokemonIndex.vue')
const Modal = () => import('../components/Modal.vue')
const Test = () => import('../views/Test.vue')

// 定义路由
const routes = [
  {
    path: '/',
    redirect: '/home',
    component: Main,
    children: [
      {
        path: '/home',
        component: Home,
      },
      {
        path: '/login',
        component: Login
      },
      {
        path: '/signup',
        component: Signup
      },
      {
        path: '/data',
        component: Data
      },
      {
        path: '/applets',
        component: Applets
      },
      {
        path: '/applets/binary-search-visualization',
        component: BinarySearchVisualization
      },
      {
        path: '/applets/pokemon-index',
        component: PokemonIndex
      },
      {
        path: '/writing',
        component: Writing
      },
      {
        path: '/blog/:id',
        component: Blog
      },
      {
        path: '/modal',
        component: Modal
      },
      {
        path: '/test',
        component: Test
      }
    ]
  },
  
]

const router = createRouter({
  history: createWebHashHistory(), 
  routes,
})

// 路由守卫
router.beforeEach((to, from) => {
  if (to.path === '/writing') {
    if (state.role === 'admin') {
      return true
    } else {
      return false
    }
  }
})

export default router