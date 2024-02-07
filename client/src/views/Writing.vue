<script setup>
import state from '../store'
import { ref, reactive } from 'vue'
import axios from '../utils/axios'
import Modal from '../components/Modal.vue'

const draftModal = ref(null)
const publishModal = ref(null)

const content = ref('### Writing here...')
const hint = ref('')
let blogID, covername

const tags = reactive([
  { text: '技术', selected: false },
  { text: '艺术', selected: false },
  { text: '随笔', selected: false },
  { text: '阅读', selected: false },
])

const data = reactive({})

function save() {
  if (!blogID) {
    // 第一次保存，创建博客
    axios.post('/blog', {
      title: title.value,
      content: content.value,
      isDraft: true,
      authorID: state.userId
    }).then(res => {
      blogID = res.data.blog._id
      hint.value = '保存成功！'
      setTimeout(() => {
        hint.value = ''
      }, 3000)
    }).catch(err => {
      alert('保存失败！')
      console.log(err)
    })
  } else {
    // 更新博客
    axios.patch(`/blog/${blogID}`, {
      title: title.value,
      content: content.value,
      authorID: state.userId,
      timeStamp: Date.now()
    }).then(res => {
      hint.value = '保存成功！'
      setTimeout(() => {
        hint.value = ''
      }, 3000)
      console.log(res)
    }).catch(err => {
      alert('保存失败！')
      console.log(err.response)
    })
  }
}

// 点击发布按钮
function publish(){
  publishModal.value.openModal()
  save()
}

// 上传封面
function uploadCover(e){
  e.preventDefault()
  fileUpload.click()

  fileUpload.addEventListener('change', e => {
    const formData = new FormData()
    formData.append('cover', e.target.files[0])
    axios.post('/uploadcover', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(res => {
      console.log(res)
      covername = res.data.cover

      const img = document.createElement('img')
      img.src = `http://localhost:5000/${covername}`
      img.style.width = '100%'
      img.style.height = '100%'
      img.style.objectFit = 'cover'

      coverDiv.innerHTML = ''
      coverDiv.appendChild(img)
      
    }).catch(err => {
      alert('上传失败！')
      console.log(err)
    })
  })

}

// 关闭模态框
function closePublishModal(){
  publishModal.value.closeModal()
}

// 确认发布
function confirmPublish(){
  const selectedTagObject = tags.filter(tag => tag.selected === true)[0]
  if (selectedTagObject.length === 0) {
    alert('请选择分类!')
    return
  }
  const selectedTag = selectedTagObject.text

  if (!covername) {
    alert('请上传封面!')
    return
  }

  const summary = document.querySelector('#summary').value
  if (!summary) {
    alert('请输入摘要!')
    return
  }

  axios.patch(`/blog/${blogID}`, {
    isDraft: false,
    tag: selectedTag,
    cover: covername,
    summary
  }).then(res => {
    console.log(res)
    closePublishModal()
    alert('发布成功！')
  }).catch(err => {
    alert('发布失败！')
    console.log(err)
  })
}

// 返回上一篇草稿
function selectLastDraft(){
  axios.get(`/blog?isDraft=true&userID=${state.userId}`).then(res => {
    
    if (res.results === 0) {
      alert('没有草稿！')
      return
    }

    const drafts = res.data.blogs
    const lastDraft = drafts[drafts.length - 1]
    title.value = lastDraft.title
    content.value = lastDraft.content
    blogID = lastDraft._id
  }).catch(err => {
    console.log(err)
  })
}

// 查看所有草稿/已发布文章
function checkAllDraft(isDraft){
  axios.get(`/blog?isDraft=${isDraft}&userID=${state.userId}`).then(res => {
    data.blogs = res.data.blogs
    // timeStamp转换为时间
    data.blogs.forEach(blog => {
      blog.time = new Date(blog.timeStamp).toLocaleDateString()
    });
    console.log(data.blogs)
    draftModal.value.openModal()
  }).catch(err => {
    console.log(err)
  })
  
}

// 选择博客
function selectBlog(e) {
  axios.get(`/blog/${e.target.id}`).then(res => {
    console.log(res)
    const blog = res.data.blog
    title.value = blog.title
    content.value = blog.content
    blogID = blog._id

    draftModal.value.closeModal()
  }).catch(err => {
    console.log(err)
  })
}

// 发布弹窗单选按钮组
function selectTag(tag){
  tags.forEach(tag => {
    tag.selected = false
  })
  tag.selected = true
}

</script>

<template>
  <div class="container h-5/6">

    <div class="flex items-center h-12">
      <div class="left">
        <button class="text-blue-500" @click="selectLastDraft">返回上一篇草稿</button>
        <button class="text-blue-500 mx-4" @click="checkAllDraft(true)">查看所有草稿</button>
        <button class="text-blue-500 " @click="checkAllDraft(false)">查看已发布文章</button>
      </div>
      <div class="middle ">
        <span class="mx-4 text-red-400 font-bold">{{ hint }}</span>
      </div>
      
    </div>

    <div class="flex">
      <input id="title" class="w-5/6 h-12 px-4 font-bold text-xl" type="text" placeholder="请在此处输入标题">
      <div class="flex w-1/6 pr-4 justify-end items-center bg-white">
        <button class="publishBtn" @click="publish">点此发布</button>
      </div>
    </div>
    <v-md-editor height="90%" v-model="content" @save="save"></v-md-editor>
  </div>
  <Modal ref="publishModal">
    <div class="publishModalContainer">
      <div class="label">
      <span>分类：</span>
      <button v-for="tag in tags" 
        :key="tag.text"
        @click="selectTag(tag)" 
        :class="tag.selected === false ? 'tagBtn' : 'tagBtn selected' "
      >{{ tag.text }}</button>
    </div>
    <form class="cover" enctype="multipart/form-data">
      <span>封面：</span>
      <span id="coverDiv" class="coverDiv" @click="uploadCover">点击上传</span>
      <input id="fileUpload" type="file" name="cover" accept=".jpg, .jpeg, .png" style="display: none">
      <!-- <button @click="uploadCover">上传</button> -->
    </form>
    <div class="flex justify-center items-center">
      <span>摘要：</span>
      <textarea class="summary" id="summary" cols="50" rows="3"></textarea>
    </div>
    <button class="publishBtn absolute bottom-8 right-8" @click="confirmPublish">确定发布</button>
    </div>
  </Modal>
  <Modal ref="draftModal">
    <div class="flex flex-col">
      <div class="my-2" v-for="blog in data.blogs" :key="blog.id" >      
        <span class="w-5/6 h-12 px-4 font-bold text-xl cursor-pointer"  :id="blog.id"  @click="selectBlog">{{ blog.title }}</span>
        <span class="px-8 float-right text-lg leading-7">{{ blog.time }}</span>
      </div>   
    </div>
  </Modal>
</template>

<style scoped>
.publishBtn{
  @apply font-bold px-4 h-8  rounded-full text-white bg-red-400 hover:bg-red-500 
}


.publishModalContainer {
  width: 40vw;
  height: 60vh;

  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
}

.tagBtn {
  color: #555;
  padding: 0.25rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #aaa;
  margin: 0 0.5rem;
}

.selected {
  border: 1px solid rgb(59, 130, 246);
  color: rgb(59, 130, 246)
} 

.coverDiv {
  @apply w-40 h-40 bg-gray-200 inline-block rounded-sm cursor-pointer;
}

.summary {
  padding: 0.5rem;
  border: 1px solid #aaa;
  border-radius: 0.5rem;
  outline: none;
}


.middle {
  /* 相对父元素居中 */
  position: absolute;
  left: 650px;
  top: 151px;
}
</style>