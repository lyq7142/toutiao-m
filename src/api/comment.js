// 文章评论相关模块
import request from '@/utils/request'

// 获取评论列表
export const getComments = params => {
  return request({
    method: 'GET',
    url: '/v1_0/comments',
    params
  })
}
// 点赞回复或评论
export const addCommentLike = commentId => {
  return request({
    method: 'POST',
    url: '/v1_0/comment/likings',
    data: {
      target: commentId
    }
  })
}
// 取消点赞回复
export const deleteCommentLike = commentId => {
  return request({
    method: 'DELETE',
    url: `/v1_0/comment/likings/${commentId}`
  })
}
// 添加评论或回复
export const addComment = data => {
  return request({
    method: 'POST',
    url: '/v1_0/comments',
    data
  })
}
