<template>
  <div class="post-comment">
    <van-field
      v-model="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请输入..."
      show-word-limit
    />
    <van-button
      size="mini"
      @click="onPost"
      :disabled="!message"
    >发布</van-button>
  </div>
</template>

<script>
import { addComment } from '@/api/comment'
export default {
  name: 'postComment',
  components: '',
  props: {
    target: {
      type: [Number, String, Object],
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      default: null
    }
  },
  data () {
    return {
      message: '' // 输入框内容
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onPost () {
      this.$toast.loading({
        message: '发布中...',
        forbiddenClick: true
      })
      const { data } = await addComment({
        target: this.target.toString(), // 评论的目标id
        content: this.message,
        art_id: this.articleId ? this.articleId.toString() : null // 文章id，回复评论要传，对文章评论不传
      })
      this.$emit('post-success', data.data.new_obj)
      this.$toast.success('发布成功')
      this.message = ''
    }
  }
}
</script>

<style lang="less" scoped>
.post-comment {
  padding: 15px;
  display: flex;
  align-items: center;
}
</style>
