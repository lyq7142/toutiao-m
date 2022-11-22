<template>
  <div class="update-name">
    <van-nav-bar
      title="修改昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    />
    <div class="name-field-wrap">
      <van-field
        v-model="localName"
        rows="2"
        autosize
        type="textarea"
        maxlength="15"
        placeholder="请输入昵称"
        show-word-limit
      />
    </div>

  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
  name: 'UpdateName',
  components: {},
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      localName: this.value
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onConfirm () {
      // 请求提交更新用户昵称
      this.$toast.loading({
        message: '保存中',
        forbidClick: true
      })
      try {
        await updateUserProfile({
          name: this.localName
        })
        this.$toast.success('保存成功')
        this.$emit('input', this.localName)
        // 修改父组件name 关闭弹出层
        this.$emit('close')
      } catch (err) {
        if (err && err.response && err.response.status === 409) {
          this.$toast.fail('昵称已存在')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.name-field-wrap {
  padding: 20px;
}
</style>
