<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="app-nav-bar">
      <van-button
        slot="title"
        class="search-btn"
        icon="search"
        type="info"
        round
        size="small"
        to="/search"
      >搜索</van-button>
    </van-nav-bar>
    <!-- /导航栏 -->
    <!-- 文章频道列表 -->
    <!-- 标签页组件功能，只有第一次查看标签页时，才会渲染内容 -->
    <van-tabs class="channel-tabs" v-model="active">
      <van-tab
        :title="channel.name"
        v-for="channel in channels"
        :key="channel.id"
      >
      <!-- 文章列表 -->
      <article-list :channel="channel" />
      <!-- /文章列表 -->
      </van-tab>
      <div
        slot="nav-right"
        @click="isChannelEditShow=true"
        class="wap-nav-wrap"
      >
        <van-icon name="wap-nav" />
      </div>
    </van-tabs>
    <!-- /文章频道列表 -->
    <van-popup
      v-model="isChannelEditShow"
      get-container="body"
      round
      position="bottom"
      class="channel-edit-popup"
      closeable
      close-icon-position="top-left"
      :style="{ height: '100%' }"
    >
      <channel-edit
        :user-channels="channels"
        :active="active"
        @userChannels= "updateUserChannels"
        @deleteChannels="deleteUserChannels"
        @close="isChannelEditShow = false"
        @update-active="active=$event"
      />
    </van-popup>

  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list'
import ChannelEdit from './components/channel-edit'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'
export default {
  name: 'HomeIndex',
  components: {
    ArticleList,
    ChannelEdit
  },
  props: {},
  data () {
    return {
      active: 0, // 控制被激活的标签
      channels: [], // 频道列表
      isChannelEditShow: false // 控制编辑频道的显示状态
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created () {
    this.loaderChannels()
  },
  mounted () {},
  methods: {
    async loaderChannels () {
      let channels = []
      // 请求处理频道数据
      if (this.user) {
        // 已登录，请求获取线上用户频道列表数据
        const { data } = await getUserChannels()
        channels = data.data.channels
      } else {
        // 未登录，判断是否有本地存储
        const localChannels = getItem('user-channels')
        // 如果有本地存储的频道列表则使用
        if (localChannels) {
          channels = localChannels
        } else {
          // 如果没有登录，也没有本地存储的频道，就请求获取默认推荐的频道列表
          const { data } = await getUserChannels()
          channels = data.data.channels
        }
      }
      this.channels = channels
    },
    updateUserChannels (index) {
      return this.channels.push(index)
    },
    deleteUserChannels (index) {
      if (index <= this.active) {
        this.active -= 1
      }
      return this.channels.splice(index, 1)
    }
    // onUpdateActive (index) {
    //   this.active = index
    // }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  /deep/ .van-nav-bar__title {
    max-width: none;
  }
  .search-btn {
    width: 550px;
    height: 60px;
    background: #5babfd;
    border: none;
    .van-icon {
      font-size: 32px;
    }
    .van-button__text {
      font-size: 28px;
    }
  }
  .channel-tabs {
    /deep/ .van-tab {
      border-right: 1px solid #edeff3;
      border-bottom: 1px solid #edeff3;
    }
    /deep/ .van-tabs__nav {
      margin-right: 60px;
    }
    /deep/ .van-tabs__line {
      bottom: 40px;
      width: 30px !important;
      height: 6px;
      background: #3296fa;
    }
  }
  .wap-nav-wrap {
    position: fixed;
    right: 0;
    width: 75px;
    height: 88px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    opacity: .9;
    .van-icon {
      font-size: 45px;
    }
    &:before {
      content: '';
      width: 2px;
      height: 80px;
      background: url('./gradient-gray-line.png') no-repeat;
      background-size: contain;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
}
</style>
