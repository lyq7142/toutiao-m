<template>
  <div class="comment-reply">
    <!-- 头部信息 -->
    <van-nav-bar :title="`${comment.reply_count}条回复`">
      <van-icon
        slot="left"
        name="cross"
        @click="$emit('close')"
      />
    </van-nav-bar>
    <!-- 当前评论项 -->
    <comment-item
      :comment="comment"
    />
    <!-- 所有评论回复 -->
    <van-cell title="所有回复" />
    <comment-list
      :source="comment.com_id"
      type="c"
      :list="commentList"
    />
    <!-- 底部区域 -->
     <div class="article-bottom">
      <van-button
        class="comment-btn"
        type="default"
        round
        size="small"
        @click="isPostShow = true"
      >写评论</van-button>
    </div>
    <!-- 发布回复 -->
    <van-popup
    v-model="isPostShow"
    position="bottom"
    >
      <post-comment
        :target="comment.com_id"
        :article-id="articleId"
        @post-success="onPostSuccess"
      />
    </van-popup>
  </div>
</template>

<script>
import CommentItem from './comment-item'
import CommentList from './comment-list'
import PostComment from './post-comment'

export default {
  name: 'Comment-reply',
  components: {
    CommentItem,
    CommentList,
    PostComment
  },
  props: {
    comment: {
      type: Object,
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      isPostShow: false,
      CommentList: [], // 评论的回复列表
      comment2: this.comment
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onPostSuccess (comment) {
      this.CommentList.unshift(comment)
      this.comment2.reply_count++
      this.isPostShow = false
    }
  }
}
</script>

<style lang="less" scoped>
.article-bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-sizing: border-box;
  height: 100px;
  border-top: 1px solid #d8d8d8;
  background-color: #fff;
  .comment-btn {
    width: 400px;
    height: 60px;
    border: 2px solid #eeeeee;
    font-size: 27px;
    line-height: 60px;
    color: #a7a7a7;
  }
}
</style>
