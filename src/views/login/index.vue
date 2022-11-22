<template>
  <div class="login-container">
    <van-nav-bar
        class="app-nav-bar"
        title="注册 / 登录"
        left-arrow
        @click-left="$router.back()"
    />
        <!-- $router.back()返回上一页 -->
        <!-- 登录表单 -->
        <van-form
          :show-error="false"
          :show-error-message="false"
          validate-first
          ref="login-form"
          @submit="onLogin"
          @failed="onFailed"
        >
            <van-field
                v-model="user.mobile"
                icon-prefix="toutiao"
                left-icon="shouji"
                placeholder="请输入手机号"
                name="mobile"
                :rules="formRules.mobile"
            />
            <van-field
              v-model="user.code"
              clearable
              icon-prefix="toutiao"
              left-icon="yanzhengma"
              placeholder="请输入验证码"
              name="code"
              :rules="formRules.code"
            >
              <template #button>
                <van-count-down
                v-if="isCountDownShow"
                  :time="1000 * 60"
                  format="ss s"
                  @finish="isCountDownShow = false"
                />
                <van-button
                  v-else
                  class="send-btn"
                  size="small"
                  round
                  :loading="isSendSmsLoading"
                  @click.prevent="onSendSms"
                >获取验证码</van-button>
              </template>
            </van-field>

             <div class="login-btn-wrap">
              <van-button
                class="login-btn"
                type="info"
                block
              >登录</van-button>
             </div>
          </van-form>
        <!-- /登录表单 -->
  </div>

</template>

<script>
import { login, sendSms } from '@/api/user'

import { Toast } from 'vant'
export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '', // 手机号
        code: '' // 验证码
      },
      formRules: {
        mobile: [
          { required: true, message: '请输入手机号' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '手机号格式错误' }
        ],
        code: [
          { required: true, message: '请输入验证码' },
          { pattern: /^\d{6}$/, message: '验证码格式错误' }
        ]
      },
      isCountDownShow: false, // 控制倒计时和发送按钮的显示状态
      isSendSmsLoading: false // 发送验证码按钮的loading状态
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onLogin () {
      Toast.loading({
        message: '登录中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 值为0时持续展示，新的提示会把它干掉，不用手动关
      })
      // 找数据接口
      // 封装请求方法
      // 请求调用登录
      try {
        const { data } = await login(this.user)
        Toast.success('登录成功')
        // 将后端返回的用户登录状态 放入vuex
        this.$store.commit('setUser', data.data)
        // 登录成功 跳转回原页面
        this.$router.back()
      } catch (err) {
        console.log(err)
        Toast.fail('登录失败，手机号或验证码错误')
      }
      // 处理响应结果
    },
    onFailed (error) {
      if (error.errors[0]) {
        this.$toast({
          message: error.errors[0].message, // 提示信息
          position: top
        })
      }
    },
    async onSendSms () {
      // 校验手机号码
      try {
        await this.$refs['login-form'].validate('mobile')
        // 验证通过，请求发送验证码
        this.isSendSmsLoading = true // 防止网速慢，用户多次点击发送行为
        await sendSms(this.user.mobile)
        // 隐藏发送按钮，显示倒计时
        this.isCountDownShow = true
        // 隐藏倒计时，显示发送按钮 -> 监视倒计时的finish事件处理
      } catch (err) {
        let message = ''
        if (err && err.response && err.response.status === 429) {
          // 发送短信失败的错误提示
          message = '发送太频繁，请稍后重试'
        } else if (err.name === 'mobile') {
          // 表单验证失败的错误提示
          message = err.message
        } else {
          message = '发送失败，请稍后重试'
        }
        // 提示用户
        this.$toast({
          message,
          position: top
        })
      }
      this.isSendSmsLoading = false // 无论发送成功或失败 都要关闭发送按钮的loading状态
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  .login-btn-wrap {
    // padding: 26px 16px;
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
      .van-button__text {
        font-size: 15px;
      }
    }
  }
  .send-btn {
    // width: 152px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    .van-button__text {
      font-size: 22px;
      color: #666;
    }
  }
}
</style>
