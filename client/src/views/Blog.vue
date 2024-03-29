<script setup>
import { ref, reactive, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from '../utils/axios'
import showdown from 'showdown'
import DivInput from '../components/DivInput.vue'
import Modal from '../components/Modal.vue'
import state from '../store'

const router = useRouter()
const route = useRoute()
const blogID = ref(route.params.id)
const deleteReviewModal = ref(null)

const data = reactive({
  blog: {},
  relatedBlogs: []
})

// console.log(route.params)
function getData(blogID) {
  axios.get(`/blog/${blogID}`).then(res => {
    data.blog = res.data.blog

    // timeStamp转换为时间
    data.blog.time = new Date(data.blog.timeStamp).toLocaleString()
    data.blog.reviews.forEach(review => {
      review.time = new Date(review.timeStamp).toLocaleString()
    });

    // 获取相关博客
    axios.get(`/blog?tag=${data.blog.tag}&_id[$ne]=${data.blog.id}`).then(res => {
      data.relatedBlogs = res.data.blogs
    }).catch(err => console.log(err))

  }).catch(err => {
    console.log(err)
  })

}

getData(blogID.value)

// 监听路由参数变化
watch(blogID, (newVal, oldVal) => {
  getData(newVal)
})

function createReview() {
  const content = document.querySelector('.divInput').innerText
  if (content === '') return
  axios.post(`/blog/${blogID.value}/reviews`, {content}).then(res => {
    getReviews()
    document.querySelector('.divInput').innerText = ''
  }).catch(err => {
    console.log(err)
    alert('评论失败！')
  })
}

function getReviews(){
  axios.get(`/blog/${blogID.value}/reviews`).then(res => {
    data.blog.reviews = res.data.reviews
    data.blog.reviews.forEach(review => {
      review.time = new Date(review.timeStamp).toLocaleString()
    });
  }).catch(err => {
    console.log(err)
  })
}

function deleteReview(reviewID) {
  deleteReviewModal.value.openModal()
  // axios.delete(`/blog/${blogID.value}/reviews/${reviewID}`).then(res => {
  //   getReviews()
  // }).catch(err => {
  //   console.log(err)
  //   alert('删除评论失败！')
  // })
}

</script>

<template>
  <div class="container px-32 flex">
    <div class="left w-2/3">
      <div class="bg-white px-8 pb-4">
        <h1 class="py-4  text-4xl mt-4 rounded-t">{{ data.blog.title }}</h1>
        <span v-if="data.blog.userID" class="pr-4 text-gray-500">{{ data.blog.userID.name }} </span>
        <span class="pr-8 text-gray-500">{{ data.blog.time }}</span>
        <span class="text-gray-500">
          <font-awesome-icon icon="eye" />
          <span class="pl-1 pr-4 text-gray-500">{{ data.blog.views}}</span>
        </span>
      </div>
      <v-md-editor class="content" :model-value="data.blog.content" mode="preview" ></v-md-editor>
    </div>
    <div class="right w-1/3">
      <div class="bg-white rounded m-4 pb-4 h-fit">
        <h2 class="p-4 mb-2 border-b">相关文章</h2>
        <div v-if="data.relatedBlogs.length && data.relatedBlogs.length === 0" class="p-4 text-lg text-gray-500">暂无</div>
        <div v-else class="px-4 py-2 text-lg text-gray-500 hover:text-cyan-700 cursor-pointer" 
          v-for="relatedBlog in data.relatedBlogs" :key="relatedBlog.id" @click="blogID = relatedBlog.id">{{ relatedBlog.title }}</div>
      </div>
      <div class="bg-white rounded m-4 h-fit">
        <h2 class="p-4">评论</h2>
        <div v-if="data.relatedBlogs.length && data.relatedBlogs.length === 0" class="p-4 text-lg text-gray-500 border-t">暂无</div>
        <div v-else v-for="review in data.blog.reviews" class="p-4 text-lg border-t" >
          <div class="flex items-center justify-between">
            <span>{{ review.content }}</span>
            <font-awesome-icon icon="fa-regular fa-trash-can" 
              v-if="state.role === 'admin' || state.userID === review.userID._id" 
              @click="deleteReview(review._id)"
              class="text-base text-gray-400  cursor-pointer hover:text-gray-600" 
            />
          </div>     
          <div class="text-sm text-gray-400 flex justify-between">
            <span>{{ review.time }}</span>
            <span>{{ review.userID.name }}</span>
          </div>
        </div>
        <div class="border-t p-2" >
          <DivInput @keyup.ctrl.enter="createReview" placeholder="输入评论，Enter换行，Ctrl+Enter发布" />
        </div>
      </div>
    </div>
    <Modal ref="deleteReviewModal"/>
  </div>
</template>

<style>
.v-md-editor {
  margin-bottom: 1rem;
  border-radius: 0 0 0.25rem 0.25rem;
}

</style>