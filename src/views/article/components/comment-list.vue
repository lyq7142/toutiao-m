<template>
  <div class="comment-list">
    <van-cell title="全部评论"></van-cell>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
    <comment-item
      v-for="(comment, index) in list"
      :key="index"
      :comment="comment"
      @reply-click="$emit('reply-click', $event)"
    />
    </van-list>
  </div>
</template>

<script>
import { getComments } from '@/api/comment'
import CommentItem from './comment-item'
export default {
  name: 'CommentList',
  components: {
    CommentItem
  },
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    type: {
      type: String,
      default: 'a'
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      list2: this.list,
      loading: false,
      finished: false,
      offset: null, // 获取下一页数据页码
      limit: 10 // 每页大小
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onLoad () {
      // 请求获取数据
      const { data } = await getComments({
        type: this.type, // 评论类型，a --文章 c --评论
        source: this.source.toString(), // 源id
        offset: this.offset,
        limit: this.limit
      })
      this.$emit('update-total-count', data.data.total_count)
      const { results } = data.data
      this.list2.push(...results)
      this.loading = false
      if (results.length) {
        this.offset = data.data.last_id
      } else {
        this.finished = true
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
