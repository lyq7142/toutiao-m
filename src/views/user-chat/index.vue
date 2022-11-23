<template>
  <div class="user-chat">
    <!-- 导航栏 -->
    <van-nav-bar
      class="app-nav-bar"
      title="小智同学"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- 消息列表 -->
    <van-cell-group class="message-list" ref="message-list">
      <van-cell
        :title="item.msg"
        v-for="(item, index) in messages"
        :key="index"
      />

    </van-cell-group>
    <!-- 发送消息 -->
    <van-cell-group class="send-message-wrap">
      <van-field
        v-model="message"
        placeholder="请输入消息"
        :border="false"
      />
      <van-button
        type="primary"
        size="small"
        @click="onSend">发送</van-button>
    </van-cell-group>
  </div>
</template>

<script>
import io from 'socket.io-client'
// 发送消息 socket.emit('消息类型',内容)
// 接收消息 socket.on('消息类型',function(data){ })
import { getItem, setItem } from '@/utils/storage'
export default {
  name: 'UserChat',
  components: {},
  props: {
  },
  data () {
    return {
      message: '',
      socket: null,
      messages: getItem('chat-messages') || []
    }
  },
  computed: {},
  watch: {
    messages () {
      setItem('chat-messages', this.messages)
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    }
  },
  created () {
    // 建立连接
    const socket = io('http://toutiao.itheima.net')
    this.socket = socket
    socket.on('connect', () => {
      console.log('连接建立')
    })
    socket.on('disconnect', () => {
      console.log('断开连接了')
    })
    // 监听message事件，接收服务端消息
    socket.on('message', data => {
      this.messages.push(data)
    })
  },
  mounted () {
    this.scrollToBottom()
  },
  methods: {
    onSend () {
      // 请求发送消息
      const data = {
        msg: this.message,
        timestamp: Date.now()
      }
      this.socket.emit('message', data)
      this.messages.push(data)
      this.messages = '' // 清空输入框
    },
    scrollToBottom () {
      const list = this.$refs['message-list']
      list.scrollTop = list.scrollHeight
    }
  }
}
</script>

<style lang="less" scoped>
.message-list {
  position: fixed;
  left: 0;
  right: 0;
  top: 92px;
  bottom: 88px;
  overflow-y: auto;
}
.send-message-wrap {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  padding: 0 15px;
  align-items: center;
}
</style>
