import request from '@/utils/request'

// 获取全部频道列表
export const getAllChannels = () => {
  return request({
    method: 'GET',
    url: '/v1_0/channels'
  })
}
// 获取用户频道列表
export const addUserChannel = data => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/channels',
    data
  })
}
// 获取用户频道列表
export const deleteUserChannel = channelId => {
  return request({
    method: 'DELETE',
    url: `/v1_0/user/channels/${channelId}`
  })
}
