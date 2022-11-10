<template>
  <div id="app">
    <!-- 路由的出口 -->
    <router-view/>
    <h1>toutiao</h1>
    <div class="box"></div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
.box{
  width: 375px;
  height: 84px;
  background-color: pink;
}
</style>
