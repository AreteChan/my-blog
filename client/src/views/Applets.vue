<script setup>
  import AppCard from '../components/AppCard.vue';
  
  const appList = [
    {
      imgName: 'binary-search-visualization.png',
      title: '二分查找可视化',
      link: 'binary-search-visualization'
    },
    {
      imgName: 'pokemon-index.png',
      title: '极简宝可梦图鉴',
      link: 'pokemon-index'
    }
  ]
</script>

<template>
  <div class="container px-20 py-4 flexCenter">
    <AppCard v-for="app in appList" :imgName="app.imgName" :title="app.title" :link="app.link"/>
  </div>
</template>

<style scoped>

</style>
