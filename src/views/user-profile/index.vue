<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="app-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- 列表 -->
    <input
      type="file"
      hidden
      ref="file"
      accept="image/*"
      @change="onFileChange"
    >
    <van-cell title="头像" is-link center @click="$refs.file.click()">
      <van-image
        width="30"
        height="30"
        round
        fit="cover"
        :src="user.photo"
      />
    </van-cell>
    <van-cell
      title="昵称"
      is-link
      :value="user.name"
      @click="isEditNameShow = true"
    />
    <van-cell
      title="性别"
      is-link
      :value="user.gender === 0 ? '男' : '女'"
      @click="isEditGenderShow = true"
    />
    <van-cell
      title="生日"
      is-link
      :value="user.birthday"
      @click="isEditBirthdayShow = true"
    />
    <!-- 修改昵称 -->
    <van-popup
      v-model="isEditNameShow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <update-name
        v-if="isEditNameShow"
        v-model="user.name"
        @close="isEditNameShow = false"
      />
    </van-popup>
    <!-- 修改性别 -->
    <van-popup
      v-model="isEditGenderShow"
      position="bottom"
    >
    <update-gender
      v-model="user.gender"
      @close="isEditGenderShow = false"
    />
    </van-popup>
    <!-- 修改生日 -->
    <van-popup
      v-model="isEditBirthdayShow"
      position="bottom"
    >
      <update-birthday
        v-model="user.birthday"
        @close="isEditBirthdayShow = false"
      />
    </van-popup>
    <!-- 修改用户头像 -->
    <van-popup
      class="update-photo-popup"
      v-model="isEditPhotoShow"
      style="height: 100%"
      position="bottom"
    >
      <update-photo
        v-if="isEditPhotoShow"
        :file="previewImage"
        @close="isEditPhotoShow = false"
        @update-photo="user.photo = $event"
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './components/update-name'
import UpdateGender from './components/update-gender'
import UpdateBirthday from './components/update-birthday'
import UpdatePhoto from './components/update-photo'
export default {
  name: 'UserProfile',
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto
  },
  props: {},
  data () {
    return {
      user: {}, // 用户数据
      isEditNameShow: false, // 编辑昵称的显示状态
      isEditGenderShow: false,
      isEditBirthdayShow: false,
      isEditPhotoShow: false,
      previewImage: null
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadUserProfile()
  },
  mounted () {},
  methods: {
    async loadUserProfile () {
      const { data } = await getUserProfile()
      this.user = data.data
    },
    onFileChange () {
      const file = this.$refs.file.files[0]
      this.previewImage = file
      this.isEditPhotoShow = true

      this.$refs.file.value = ''
    }
  }
}
</script>

<style lang="less" scoped>
.van-popup {
  background-color: #f5f7f9;
}
.update-photo-popup {
  background-color: #000;
}
</style>
