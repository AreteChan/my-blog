<script setup>
  import { reactive, ref, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
  let nums = reactive([1,2,3,4,5,6])
  const left = ref(0)
  const right = ref(0)
  const targetIdx = ref(1)
  const len = ref(15)
  const cursor = ref('pointer')

  //computed
  const mid = computed(() => Math.floor((left.value + right.value) / 2))
  const target = computed({
    get(){
      return nums[targetIdx.value]
    },
    set(val){
      targetIdx.value = nums.indexOf(val)
    }
  })

  //watch
  const n = ref([])
  
  function watchFunc(className, val, old){
    if (old >= len.value){
      n.value[val].classList.add(className)
    } else {
      n.value[old].classList.remove(className)
      n.value[val].classList.add(className)
    }
  }
  watch(left,(val, old)=>{
    watchFunc('left', val, old)
  })
  watch(right,(val, old)=>{
    watchFunc('right', val, old)
  })
  watch(mid,(val, old)=>{
    watchFunc('mid', val, old)
  })
  watch(targetIdx,(val, old)=>{
    watchFunc('target', val, old)
  })
  watch(len,(val)=>{
    newNums()
    if (val > 30) this.len = 30
    if (val < 3) this.len = 3
    if (targetIdx.value >= val) targetIdx.value = 1
  })
  
  //播放按钮
  function next(){
    if (left.value <= right.value) {
      let num = nums[mid.value]
      if (target.value === num) {
        alert("目标值索引为：" + mid.value)
      } else if (target.value > num) {
        left.value = mid.value + 1
      } else {
        right.value = mid.value - 1
      }
    }
    cursor.value = 'not-allowed'
  }

  //判断是否为页面初始状态，只有初始状态下可以修改target
  function changeTarget(e){
    if (right.value === nums.length - 1 & left.value === 0) {
      target.value = Number(e.target.innerText)
    }
  }

  //创建一个新数组
  function newNums(){
    let newNums = []
    for (let i = 0; i < len.value; i++){
      let num = Math.floor(Math.random()*100) 
      if (!newNums.includes(num)) {
        newNums.push(num)
      } else {
        i--
      }
      newNums.sort((a, b) => a - b)
    }
    for(let i = 0; i < newNums.length; i++){
      nums[i] = newNums[i]
    }
    for(let i = nums.length - 1; i >= newNums.length; i--){
      nums.pop()
    }
    cursor.value = 'pointer'
    left.value = 0
    // DOM更新完成后再执行回调函数
    nextTick(()=>{right.value = nums.length - 1})
  }

  //给数组中相应的索引添加颜色
  function addColor(){
    n.value[left.value].classList.add('left')
    n.value[right.value].classList.add('right')
    n.value[mid.value].classList.add('mid')
    n.value[targetIdx.value].classList.add('target')
  }

  //初始化
  onBeforeMount(()=>{ newNums() })
  onMounted(()=>{ addColor() })
    
</script>

<template>
  <div id="BinarySearch">
    <span v-for="(n,idx) in nums" :key="idx" ref="n" @click="changeTarget" :style="{cursor}">{{n}}</span>
    <div class="btn-container">
      <button @click="newNums">New Nums</button>
      <button @click="next">Play</button>
      <button class="lenBtn">Len:<input type="number" min="3" max="30" v-model.number.lazy="len"></button>
    </div>
    <div class="color">
      <span></span><label>left</label>
      <span></span><label>mid</label>
      <span></span><label>right</label>
      <span></span><label>target</label>
    </div>
  </div>  
</template>

<style scoped>
#BinarySearch {
  height: calc(100vh - 3rem);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #CCE8CF;
  overflow: hidden;
  box-sizing: border-box;

  --left: #61cf7d;
  --right: #58b6ec;
  --mid: #F2BE5C;
  --target: #e37373;
}

span {
  display: inline-block;
  width: 50px;
  height: 50px;
  line-height: 50px;
  border-radius: 5px;
  background-color: rgb(237, 237, 237);
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  margin: 10px;
  transition: all 1s;
}

.left {
  background-color: var(--left);
}

.right {
  background-color: var(--right);
}

.mid {
  background-color: var(--mid);
}

.target {
  border: 5px solid var(--target);
  line-height: 40px; /* 调整文本居中 */
}

.btn-container {
  position: absolute;
  bottom: 20%;
}

button:nth-child(1) {
  background-color: var(--left);
  cursor: pointer;
}
button:nth-child(2) {
  background-color: var(--mid);
  cursor: pointer;
}
button:nth-child(3) {
  background-color: var(--right);
}

button {
  width: 120px;
  height: 50px;
  margin: 0 7px;
  border-radius: 25px;
  border: 0;
  background-color: var(--mid);
  font-size: 16px;
  font-weight: 500;
}

.lenBtn {
  padding-left: 25px;
}

input {
  width: 50px;
  font-size: 16px;
  background-color: transparent;
  border: none;
  border-radius: 5px;
  text-align: center;
  outline: none;
}

.targetBtn{
  padding-left: 20px;
  background-color: white;
  transition: all 1s;
  /* border: 5px solid var(--target); */
}

.targetBtn input{
  font-size: 18px;
  font-weight: bold;
}

.color {
  position: absolute;
  bottom: 30px;
}

.color span {
  width: 20px;
  height: 20px;
  margin: 0 5px;
}

.color label {
  vertical-align: 3px;
}

.color span:nth-child(1) {
  background-color: var(--left);
}
.color span:nth-child(3) {
  background-color: var(--mid);
}
.color span:nth-child(5) {
  background-color: var(--right);
}
.color span:nth-child(7) {
  border: 3px solid var(--target);
}
</style>