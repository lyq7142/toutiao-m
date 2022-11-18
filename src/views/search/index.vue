<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <form action="/">
      <van-search
        v-model="searchText"
        placeholder="请输入搜索关键词"
        show-action
        background="#3296fa"
        @search="onSearch(searchText)"
        @cancel="$router.back()"
        @focus="isResultShow = false"
      />
    </form>
    <!-- 搜索结果 -->
    <search-result
      v-if="isResultShow"
      :search-text="searchText"
    />
    <!-- 联想建议 -->
    <search-suggestion
      v-else-if="searchText"
      :search-text="searchText"
      @search="onSearch"
    />
    <!-- 历史记录 -->
    <search-history
      v-else
      :searchHistories="searchHistories"
      @search="onSearch"
      @update-histories="searchHistories = $event"
      @deleteHistory="deleteUserHistory"
    />

  </div>
</template>

<script>
import SearchSuggestion from './components/search-suggestion'
import SearchHistory from './components/search-history'
import SearchResult from './components/search-result'
import { setItem, getItem } from '@/utils/storage'
// import { getSearchHistory } from '@/api/search'
export default {
  name: 'SearchIndex',
  components: {
    SearchSuggestion,
    SearchHistory,
    SearchResult
  },
  props: {},
  data () {
    return {
      searchText: '', // 搜索输入框的内容
      isResultShow: false, // 控制搜索结果显示状态
      searchHistories: getItem('search-histories') || [] // 搜索历史数据
    }
  },
  computed: {},
  watch: {
    // 监视搜索历史记录的变化，存储到本地存储
    searchHistories () {
      setItem('search-histories', this.searchHistories)
    }
  },
  created () {},
  mounted () {},
  methods: {
    onSearch (searchText) {
      // 将输入框设置为要搜索的文本
      this.searchText = searchText
      const index = this.searchHistories.indexOf(searchText)
      if (index !== -1) {
        // 删除重复项
        this.searchHistories.splice(index, 1)
      }
      // 把最新的搜索历史放在顶部
      this.searchHistories.unshift(searchText)
      // 如果用户已登录，搜索历史记录被存储到线上
      // 如果用户没登录，则把搜索历史记录存储本地
      // setItem('search-histories', this.searchHistories)
      // 显示搜索结果
      this.isResultShow = true
    },
    deleteUserHistory (index) {
      return this.searchHistories.splice(index, 1)
    }
  }
}
</script>

<style lang="less" scoped>
.search-container {
  .van-search__action {
    color: #fff;
  }
}
</style>
