<template>
  <van-cell class="comment-item" >
    <van-image
      slot="icon"
      class="avatar"
      round
      fit="cover"
      :src="comment.aut_photo"
    />
    <div slot="title">
      <div class="title-wrap">
        <div class="name">{{ comment.aut_name }}</div>
        <div class="like-wrap" @click="onCommentLike">
          <van-icon
            class="like-icon"
            :class="{
              liked: comment.is_liking
            }"
            :name="comment.is_liking ? 'good-job' : 'good-job-o'"
          />
          <span class="like-count">{{ comment.like_count }}</span>
        </div>
      </div>
      <div class="content">{{ comment.content }}</div>
      <div>
        <span class="pubdate">{{ comment.pubdate | datetime}}</span>
        <van-button
          class="reply-btn"
          round
          size="mini"
          @click="$emit('reply-click', comment)"
        > {{ comment.reply_count }} 回复 </van-button>
      </div>
    </div>
  </van-cell>
</template>

<script>
import { addCommentLike, deleteCommentLike } from '@/api/comment'
export default {
  name: 'CommentItem',
  components: {},
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      comment2: this.comment
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onCommentLike () {
      const commentId = this.comment.com_id.toString()
      if (this.comment.is_liking) {
        await deleteCommentLike(commentId)
        this.comment2.like_count--
      } else {
        await addCommentLike(commentId)
        this.comment2.like_count++
      }
      this.comment2.is_liking = !this.comment.is_liking
    }
  }
}
</script>

<style lang="less" scoped>
.comment-item {
  .avatar {
    width: 70px;
    height: 70px;
    margin-right: 26px;
  }
  .name {
    font-size: 28px;
    color: #406599;
  }
  .content {
    font-size: 32px;
    color: #222;
  }
  .pubdate {
    font-size: 10px;
    margin-right: 20px;
  }
  .title-wrap {
    display: flex;
    justify-content: space-between;
  }
  .like-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .like-icon.liked {
    color: pink;
  }
}
</style>
