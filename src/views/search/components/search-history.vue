<template>
  <div class="search-history">
    <van-cell
      title="搜索历史"
    >
      <div v-if="isDeleteShow">
        <span @click="$emit('update-histories',[])"> 全部删除 </span>
        <span @click="isDeleteShow = false"> 完成 </span>
      </div>
      <van-icon
        v-else
        name="delete"
        @click="isDeleteShow = true"
       />
      </van-cell>

      <van-cell
        :title="history"
        v-for="(history, index) in searchHistories"
        :key="index"
        @click="onDelete(history, index)"
      >
        <van-icon
          v-show="isDeleteShow"
          name="close"
        />
      </van-cell>
  </div>
</template>

<script>
// import { setItem } from '@/utils/storage'
export default {
  name: 'SearchHistory',
  components: {},
  props: {
    searchHistories: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isDeleteShow: false // 删除的显示状态
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onDelete (history, index) {
      // 如果是删除状态 ，执行操作
      if (this.isDeleteShow) {
        // this.searchHistories.splice(index, 1)
        this.$emit('deleteHistory', index)
        // setItem('search-histories', this.searchHistories)
        return
      }
      // 非删除状态，展示搜索结果
      this.$emit('search', history)
    }
  }
}
</script>

<style lang="less" scoped></style>
