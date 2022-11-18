<template>
  <div class="article-list">
    <van-pull-refresh
    v-model="isRefreshLoading"
    :success-text="refreshSuccessText"
    success-duration="1000"
    @refresh="onRefresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <article-item
          v-for="(article, index) in articles"
          :key="index"
          :article="article"
         />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article/'
import ArticleItem from '@/components/article-item'

export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      articles: [],
      loading: false, // 控制加载中的loading状态
      finished: false, // 控制加载结束的状态，true不会触发load事件
      timestamp: null, // 获取下一页数据时间戳
      isRefreshLoading: false, // 下拉刷新的状态
      refreshSuccessText: '' // 下拉刷新成功的提示
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onLoad () {
      // 请求获取数据
      const { data } = await getArticles({
        channel_id: this.channel.id, // 频道id
        timestamp: this.timestamp || Date.now(), // 时间戳，相当于页码，请求最新数据->当前最新时间戳，下一页数据使用上一次返回的数据中时间戳
        with_top: 1 // 是否包含置顶文章，1包含，0不包含
      })
      // 把数据放进数组中
      const { results } = data.data
      this.articles.push(...results)
      // 加载状态结束
      this.loading = false
      // 数据全部加载完成
      if (results.length) {
        // 更新获取下一页数据的页码
        this.timestamp = data.data.pre_timestamp
      } else {
        // 没数据了，设置结束状态，不再触发加载
        this.finished = true
      }
    },
    async onRefresh () {
      // 下拉刷新，组件自己展示loading状态
      // 请求获取数据
      const { data } = await getArticles({
        channel_id: this.channel.id,
        timestamp: Date.now(),
        with_top: 1
      })
      // 把数据追加在数据列表的顶部
      const { results } = data.data
      this.articles.unshift(...results)
      // 关闭刷新状态
      this.isRefreshLoading = false
      this.refreshSuccessText = `更新了${results.length} 条数据`
    }
  }
}
</script>

<style lang="less" scoped></style>
