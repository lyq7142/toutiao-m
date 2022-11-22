<template>
  <div class="my-container">
    <van-cell-group v-if="user" class="my-info">
      <van-cell
        class="base-info"
        center
        :border="false"
      >
      <van-image
      class="avatar"
      slot="icon"
        round
        fit="cover"
        :src="currentUser.photo"
      />
      <div class="name" slot="title">{{currentUser.name}}</div>
      <van-button
        class="update-btn"
        siz="small"
        round
        to="/user/profile"
      >编辑资料</van-button>
      </van-cell>
      <van-grid class="data-info" :border="false">
        <van-grid-item class="data-info-item">
          <div class="text-wrap" slot="text">
            <div class="count">{{currentUser.art_count}}</div>
            <div class="text">头条</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div class="text-wrap" slot="text">
            <div class="count">{{currentUser.follow_count}}</div>
            <div class="text">关注</div>
          </div>
        </van-grid-item>
        <van-grid-item  class="data-info-item">
          <div class="text-wrap" slot="text">
            <div class="count">{{currentUser.fans_count}}</div>
            <div class="text">粉丝</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div class="text-wrap" slot="text">
            <div class="count">{{currentUser.like_count}}</div>
            <div class="text">获赞</div>
          </div>
        </van-grid-item>
      </van-grid>
    </van-cell-group>

    <div v-else class="not-login">
      <div @click="$router.push('/login')">
        <img class="mobile" src="./mobile.png">
      </div>
        <div class="text">登录 / 注册</div>
    </div>

    <van-grid class="nav-grid mb-5" :column-num="2">
      <van-grid-item
        class="nav-grid-item"
        icon-prefix="toutiao"
        icon="shoucang"
        text="收藏"
      />
      <van-grid-item
        class="nav-grid-item"
        icon-prefix="toutiao"
        icon="lishi"
        text="历史"
      />
    </van-grid>
    <van-cell v-if="user" title="消息通知" is-link to="/" />
    <van-cell class="mb-5" title="小智同学" is-link to="/" />
    <van-cell
    @click="onLogout"
      v-if="user"
      class="logout-cell"
      title="退出登录"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getCurrentUser } from '@/api/user'

export default {
  name: 'MyIndex',
  components: {},
  props: {},
  data () {
    return {
      currentUser: {} // 当前登录用户信息
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created () {
    this.loadCurrentUser()
  },
  mounted () {},
  methods: {
    async loadCurrentUser () {
      const { data } = await getCurrentUser()
      this.currentUser = data.data
    },
    onLogout () {
      // 提示用户确认退出
      this.$dialog.confirm({
        title: '退出提示',
        message: '确认要退出登录吗？'
      })
        .then(() => {
          // 确认退出
          // 清除用户登录状态 --响应式的
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          // 取消
        })
    }
  }
}
</script>

<style lang="less" scoped>
.my-container {
  .my-info {
    background: url("./banner.png") no-repeat;
    background-size: cover;
    .base-info {
      box-sizing: border-box;
      height: 115px;
      padding-top: 38px;
      padding-bottom: 11px;
      background: unset;
      .avatar {
        box-sizing: border-box;
        height: 66px;
        width: 66px;
        border: 1px solid #fff;
        margin-right: 10px;
      }
      .name {
        font-size: 15px;
        color: #fff;
      }
      .update-btn {  // 编辑资料 按钮
        height: 55px;
        line-height: 55px;
        font-size: 10px;
        color: #666;
      }
    }
    .data-info {
      .data-info-item {
        height: 130px;
        color: #fff;
        .text-wrap {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .count {
            font-size: 30px;
          }
          .text {
            font-size: 11px;
          }
        }
      }
    }
    /deep/ .van-grid-item__content {
      background: unset;
    }
  }

  .not-login {
    height: 360px;
    background: url("./banner.png") no-repeat;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .mobile {
      width: 132px;
      height: 132px;
    }
    .text {
      font-size: 28px;
      color: #fff;
    }
  }
  /deep/ .nav-grid {
    .nav-grid-item {
      height: 140px;
      .toutiao {
        font-size: 35px;
      }
      .toutiao-shoucang {
        color: #eb5253;
      }
      .toutiao-lishi {
        color: #ff9d1d;
      }
      .van-grid-item__text {
        color: #333;
        font-size: 14px;
      }
    }
  }
  .logout-cell {
    text-align: center;
    color: #d86262;
  }
  .mb-5 {
    margin-bottom: 5px;
  }
}
</style>
