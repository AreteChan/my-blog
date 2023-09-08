<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from '../utils/axios'

const data = reactive({
  blogs: []
})

const blogInfos = [
  { icon: 'clock', prop: 'time' },
  { icon: 'tag', prop: 'tag' },
  { icon: 'eye', prop: 'views' },
  { icon: 'thumbs-up', prop: 'likes' },
  { icon: 'comment', prop: 'reviewCounts' },
]

const router = useRouter()
const route = useRoute()

async function handleData(tag, sort, title) {
  try {
    let queryParams = ''
    if (tag !== undefined && tag !== 'all') {
      queryParams += `&tag=${tag}`
    }
    if (sort !== undefined) {
      queryParams += `&sort=${sort}`
    }
    if (title !== undefined && title !== '') {
      queryParams += `&title=${title}`
    }
    const resData = await axios.get(`/blog?isDraft=false${queryParams}`)
    data.blogs = resData.data.blogs
    // timeStamp转换为时间
    data.blogs.forEach(blog => {
      blog.time = new Date(blog.timeStamp).toLocaleDateString()
    });
  } catch (error) {
    console.log(error);
    alert('请求失败！')
  }
}

// 获取博客列表
handleData('all', '-timeStamp')

function filterChange() {
  const tag = document.querySelector('#tag').value
  const sort = document.querySelector('#sort').value
  const keyword = document.querySelector('#keyword').value  
  handleData(tag, sort, keyword)
}

// 跳转到某一篇博客
function linkToBlog(id) {
  router.push(`/blog/${id}`)
}
</script>

<template>
  <div class="container px-32">
    <div class="flex justify-center m-4">
       
      <div class="left w-[600px] mx-4 rounded-lg overflow-hidden">
        <div class="filter bg-white flex items-center h-12 p-4">
          <div class="flex items-center text-gray-500 border border-slate-300 rounded-lg px-2.5">
            <font-awesome-icon icon="search" />
            <input id="keyword" type="text" placeholder="搜索" autocomplete="off" class="outline-none bg-transparent h-8 px-2.5" @keyup.enter="filterChange"> 
          </div>
          <div class="ml-10 text-gray-600">
            <span>标签：</span>
            <select name="tags" id="tag" @change="filterChange">
              <option value="all" selected>所有</option>
              <option value="技术">技术</option>
              <option value="阅读">阅读</option>
              <option value="随笔">随笔</option>
            </select>
          </div>
          <div class="ml-10 text-gray-600">
            <span>排序：</span>
            <select name="sort" id="sort" @change="filterChange">
              <option value="-timeStamp" selected>时间</option>
              <option value="-views">浏览量</option>
              <option value="-likes">点赞数</option>
              <option value="-comments">评论数</option>
            </select>
          </div>
        </div>

        <div class="blogItem flex py-2.5 pr-2.5 border-t w-full h-[100px] overflow-hidden bg-white cursor-pointer hover:bg-gray-50" v-for="blog in data.blogs" :id="blog.id" @click="linkToBlog(blog.id)">
          <div class="cover w-32 mx-2.5">
            <img class="w-full h-full object-cover rounded-md" :src="`http://localhost:5000/${blog.cover}`">
          </div>
          <div class="flex flex-col w-2/3 justify-between">
            <h1 class="text-xl font-bold">{{ blog.title }}</h1>
            <div class="summary text-gray-500 text-sm">{{ blog.summary }}</div>
            <div class="flex justify-between">
              <span class="bottomSpan" v-for="blogInfo in blogInfos" :key="blogInfo.icon">
                <font-awesome-icon :icon="blogInfo.icon" />
                {{ blog[blogInfo.prop] }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="right w-1/4">
        <div class="admin flexCenter flex-col w-full h-[300px] bg-white rounded-lg">
          <div class="w-28 h-28 rounded-full">
            <img src="../assets/avatar.png" alt="avater" class="avatar object-cover w-full h-full">
          </div>
          <div class="text-2xl font-bold py-2 text-slate-800">AreteChan</div>
          <div class="flex justify-between w-20 py-2 text-2xl text-slate-600">
            <a href="https://github.com/AreteChan" target="_blank">
              <font-awesome-icon icon="fab fa-github-alt" class="hover:text-cyan-700 cursor-pointer hover:rotate-[360deg] transition-all duration-300"/>
            </a>
            <a href="https://space.bilibili.com/371765063" target="_blank">
              <font-awesome-icon icon="fab fa-bilibili" class=" hover:text-cyan-700 cursor-pointer hover:rotate-[360deg] transition-all duration-300"/>
            </a>
          </div>
        </div>
      </div>
      
    </div>
    
  </div>
</template>


<style scoped>

select {
  border: none;
  outline: none;
  box-sizing: border-box;
  font-weight: bold;
  border-radius: 4px;
  padding-right: 5px;
}


.cover {
  height: 79px;
   /* 居中对齐 */
  line-height: 79px;
  vertical-align: middle;
  overflow: hidden;
}

.avatar:hover {
  animation: shake 0.5s;
  /* 循环 */
  animation-iteration-count: infinite;
}

@keyframes shake {
  0% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(5px, -5px) rotate(5deg); }
  50% { transform: translate(0, 0) rotate(0eg); }
  75% { transform: translate(-5px, -5px) rotate(-5deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}

.summary {
  white-space:nowrap; /* 不换行 */
  overflow:hidden;
  text-overflow:ellipsis; /* 超出部分用...代替 */
}

.bottomSpan {
  @apply text-gray-400 text-xs ;
}
</style>