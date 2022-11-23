<template>
  <div id="app">
    <!-- 路由的出口 -->
    <!-- include条件缓存，只缓存layout，解决 点击每个文章都是（第一次点击的文章）的内容 -->
    <keep-alive :include="cachePages">
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'App',
  computed: {
    ...mapState(['cachePages'])
  }
}
</script>

<style lang="less">
</style>
