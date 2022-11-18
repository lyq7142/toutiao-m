<template>
  <div class="channel-edit">
    <!-- 我的频道 -->
    <van-cell center :border="false">
      <div slot="title" class="channel-title">我的频道</div>
      <van-button
        type="danger"
        plain
        round
        size="mini"
        @click="isEdit = !isEdit"
      >{{ isEdit ? '完成' : '编辑' }}</van-button>
    </van-cell>
    <van-grid :gutter="10">
      <van-grid-item
        class="grid-item"
        :class="{ active: index === active }"
        :icon="(isEdit && index !== 0) ? 'clear' : ''"
        v-for="(channel, index) in userChannels"
        :key="index"
        :text="channel.name"
        @click="onUserChannelClick(channel, index)"
      />
    </van-grid>
    <!-- 频道推荐 -->
    <van-cell center :border="false">
      <div slot="title" class="channel-title">频道推荐</div>
    </van-cell>
    <van-grid :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in recommendChannels"
        :key="index"
        :text="channel.name"
        @click="onAdd(channel)"
      />
    </van-grid>

  </div>
</template>

<script>
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    userChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allChannels: [], // 所有频道数据
      isEdit: false // 控制编辑显示状态
    }
  },
  computed: {
    ...mapState(['user']),
    recommendChannels () { // 推荐的频道列表
      // 所有频道-我的频道 = 剩下的推荐频道
      // filter 过滤数据，根据返回的true收集数据
      return this.allChannels.filter(item => {
        // 判断channel是否属于用户频道，找到满足的元素
        return !this.userChannels.find(userItem => {
          return userItem.id === item.id
        })
      })
    }
  },
  watch: {},
  created () {
    this.loadAllChannels()
  },
  mounted () {},
  methods: {
    async loadAllChannels () {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
      } catch (err) {
        this.$toast('获取所有频道数据失败')
      }
    },
    async onAdd (channel) {
      // this.userChannels.push(channel)
      this.$emit('userChannels', channel)
      // 数据持久化
      if (this.user) { // 登录了，数据存储到线上
        await addUserChannel({
          channels: [
            { id: channel.id, seq: this.userChannels.length }
          ]
        })
      } else { // 没登录，数据存本地
        setItem('user-channels', this.userChannels)
      }
    },
    onUserChannelClick (channel, index) {
      if (this.isEdit && index !== 0) { // 编辑状态，删除频道
        this.deleteChannel(channel, index)
      } else { // 非编辑状态，切换频道
        this.switchChannel(index)
      }
    },
    async deleteChannel (channel, index) {
      // this.userChannels.splice(index, 1)
      this.$emit('deleteChannels', index)
      // 数据持久化
      if (this.user) { // 登录了，数据存储到线上
        await deleteUserChannel(channel.id)
      } else { // 没登录，数据存本地
        setItem('user-channels', this.userChannels)
      }
    },
    switchChannel (index) {
      this.$emit('update-active', index)
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
.channel-edit {
  padding-top: 110px;
  .channel-title {
    font-size: 32px;
    color: #333;
  }
  .grid-item {
    width: 160px;
    height: 86px;
    /deep/ .van-grid-item__content {
      background-color: #f4f5f6;
      .van-grid-item__text {
        font-size: 25px;
        color: #222;
        margin-top: 0;
      }
    }
    /deep/ .van-grid-item__icon {
      position: absolute;
      right: -10px;
      top: -10px;
      font-size: 35px;
      color: #ccc;
    }
  }
  .active {
    /deep/ .van-grid-item__text{
      color: red !important;
    }
  }
}
</style>
