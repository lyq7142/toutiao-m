<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="app-nav-bar"
      title="文章详情"
      left-arrow
      @click-left="$router.back()"
    />
    <div class="article-wrap">
      <h1 class="title">{{article.title}}</h1>
      <van-cell center class="user-info">
      <div slot="title" class="name">{{article.aut_name}}</div>
      <van-image
        class="avatar"
        slot="icon"
        round
        fit="cover"
        :src="article.aut_photo"
      />
      <div slot="label" class="pubdate">{{article.pubdate | relativeTime}}</div>
      <van-button
        class="follow-btn"
        :type="article.is_followed ? 'default' : 'info'"
        :icon="article.is_followed ? '' : 'plus'"
        round
        size="small"
        :loading="isFollowLoading"
        @click="onFollow"
      >{{article.is_followed ? '已关注' : '关注'}}</van-button>
      </van-cell>
      <div
        class="markdown-body"
        v-html="article.content"
        ref="article-content"
      ></div>
      <van-divider>正文结束</van-divider>
      <!-- 文章评论列表 -->
      <comment-list
        :source="articleId"
        :list="commentList"
        @update-total-count="totalCommentCount = $event"
        @reply-click="onReplyClick"
      />
    </div>

    <!-- 底部区域 -->
    <div class="article-bottom">
      <van-button
        class="comment-btn"
        type="default"
        round
        size="small"
        @click="isPostShow = true"
      >写评论</van-button>
      <van-icon
        name="comment-o"
        :info="totalCommentCount"
        color="#777"
      />
      <van-icon
        :name="article.is_collected ? 'star' :'star-o'"
        :color="article.is_collected ? 'orange' : '#777'"
        @click="onCollect"
      />
      <van-icon
        :name="article.attitude === 1 ? 'good-job': 'good-job-o'"
        :color="article.attitude === 1 ? 'pink': '#777'"
        @click="onLike"
      />
      <van-icon name="share" color="#777" />
    </div>
    <!-- 发布评论 -->
    <van-popup
      v-model="isPostShow"
      position="bottom"
      :style="{ height: '20%' }"
    >
      <post-comment
        :target="articleId"
        @post-success="onPostSuccess"
      />
    </van-popup>
    <!-- 评论回复 -->
    <van-popup
      v-model="isReplyShow"
      position="bottom"
    >
      <comment-reply
        v-if="isReplyShow"
        :comment="replyComment"
        :article-id="articleId"
        @close="isReplyShow = false"
      />
    </van-popup>

  </div>
</template>

<script>
import './github-markdown.css'
import { getArticleById, addCollect, deleteCollect, addLike, deleteLike } from '@/api/article'
import { ImagePreview } from 'vant'
import { addFollow, deleteFollow } from '@/api/user'
import CommentList from './components/comment-list'
import PostComment from './components/post-comment'
import CommentReply from './components/comment-reply'
// 组件中获取动态路由参数
// 方法一：this.$route.params.articleId
// 方法二：props 传参
export default {
  name: 'ArticleIndex',
  components: {
    CommentList,
    PostComment,
    CommentReply
  },
  props: {
    articleId: {
      type: [String, Number, Object],
      required: true
    }
  },
  data () {
    return {
      article: {}, // 文章数据
      isFollowLoading: false, // 关注用户按钮的loading
      isCollectLoading: false, // 收藏的loading状态
      isPostShow: false, // 控制发布评论的显示状态
      commentList: [], // 文章评论列表
      totalCommentCount: 0, // 评论总数量
      isReplyShow: false, // 控制回复的显示状态
      replyComment: {} // 当前回复评论对象
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticle()
  },
  mounted () {},
  methods: {
    async loadArticle () {
      const { data } = await getArticleById(this.articleId)
      this.article = data.data
      // 获取文章内容dom容器
      // 得到所有img标签，数据改变影响视图更新不及时，放到nextTick中能马上更新视图
      this.$nextTick(() => {
        this.handlePreviewImage()
      })
      // 循环img列表，注册点击事件
      // 在事件处理函数中调用ImagePreview()预览
    },
    handlePreviewImage () {
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')
      const imgPaths = []
      imgs.forEach((img, index) => {
        imgPaths.push(img.src)
        img.onclick = function () {
          ImagePreview({
            images: imgPaths,
            startPosition: index
          })
        }
      })
    },
    async onFollow () {
      this.isFollowLoading = true
      if (this.article.is_followed) {
        // 已关注，取消关注
        await deleteFollow(this.article.aut_id)
      } else {
        // 未关注，添加关注
        await addFollow(this.article.aut_id)
      }
      this.article.is_followed = !this.article.is_followed
      this.isFollowLoading = false
    },
    async onCollect () {
      this.$toast.loading({
        message: '操作中...',
        forbidClick: true
      })
      if (this.article.is_collected) {
        // 已收藏，取消收藏
        await deleteCollect(this.articleId)
      } else {
        // 未收藏，收藏
        await addCollect(this.articleId)
      }
      this.article.is_collected = !this.article.is_collected
      this.$toast.success(`${this.article.is_collected ? '' : '取消'}收藏成功`)
    },
    async onLike () {
      this.$toast.loading({
        message: '操作中...',
        forbidClick: true
      })
      if (this.article.attitude === 1) {
        // 已点赞，取消
        await deleteLike(this.articleId)
        this.article.attitude = -1
      } else {
        // 未点赞，点赞
        await addLike(this.articleId)
        this.article.attitude = 1
      }
      this.$toast.success(`${this.article.attitude === 1 ? '' : '取消'}点赞成功`)
    },
    onPostSuccess (comment) {
      this.commentList.unshift(comment)
      this.totalCommentCount++ // 更新评论总数
      this.isPostShow = false
    },
    onReplyClick (comment) {
      this.replyComment = comment
      this.isReplyShow = true
    }
  }
}
</script>

<style lang="less" scoped>
.article-wrap {
  position: fixed;
  left: 0;
  right: 0;
  top: 90px;
  bottom: 95px;
  overflow-y: auto;
}
.title {
  font-size: 40px;
  color: #3a3a3a;
  padding: 28px;
  background-color: #fff;
  margin: 0;
}
.user-info {
  .avatar {
    width: 70px;
    height: 70px;
    margin-right: 15px;
  }
  .name {
    font-size: 24px;
    color: #333;
  }
  .pubdate {
    font-size: 22px;
    color: #b4b4b4;
  }
  .follow-btn {
    width: 170px;
    height: 60px;
  }
}
.markdown-body {
  padding: 28px;
  background-color: #fff;
}
// 底部导航栏
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
    width: 282px;
    height: 60px;
    border: 2px solid #eeeeee;
    font-size: 27px;
    line-height: 60px;
    color: #a7a7a7;
  }
}
</style>
